-- ============================================================
-- NestPH — Supabase Schema + RLS + Trigger + Storage
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

CREATE TABLE public.agents (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  years_experience INTEGER DEFAULT 0,
  fb_username     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'suspended')),
  role            TEXT NOT NULL DEFAULT 'agent'
                    CHECK (role IN ('agent', 'super_admin')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price         DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL
                  CHECK (property_type IN ('house', 'condo', 'apartment', 'land', 'commercial')),
  status        TEXT NOT NULL DEFAULT 'for_sale'
                  CHECK (status IN ('for_sale', 'sold', 'pending')),
  bedrooms      INTEGER,
  bathrooms     INTEGER,
  area_sqft     INTEGER,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  zip_code      TEXT,
  images        TEXT[] DEFAULT '{}',
  amenities     TEXT[] DEFAULT '{}',
  featured      BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  agent_id        UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  message         TEXT NOT NULL,
  recaptcha_score DECIMAL(3,2),
  status          TEXT NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new', 'read', 'replied')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 3. SUPER ADMIN TRIGGER
-- Automatically sets role = 'super_admin' when the registered
-- email matches SUPER_ADMIN_EMAIL env var on first login.
-- Because env vars are not available in SQL triggers, we
-- hardcode the email here. Update if SUPER_ADMIN_EMAIL changes.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  super_admin_email TEXT := 'noynay09xavier@gmail.com';
  agent_role TEXT := 'agent';
  agent_status TEXT := 'pending';
BEGIN
  IF NEW.email = super_admin_email THEN
    agent_role := 'super_admin';
    agent_status := 'approved';
  END IF;

  INSERT INTO public.agents (id, name, email, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    agent_role,
    agent_status
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.agents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries  ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agents
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── agents ────────────────────────────────────────────────

-- Public can read approved agents
CREATE POLICY "agents: public read approved"
  ON public.agents FOR SELECT
  USING (status = 'approved');

-- Super admin can read all agents
CREATE POLICY "agents: super_admin read all"
  ON public.agents FOR SELECT
  USING (public.is_super_admin());

-- Agent can read own row (for dashboard)
CREATE POLICY "agents: own read"
  ON public.agents FOR SELECT
  USING (id = auth.uid());

-- Agent can update own row
CREATE POLICY "agents: own update"
  ON public.agents FOR UPDATE
  USING (id = auth.uid());

-- Super admin can update any agent (approve/suspend)
CREATE POLICY "agents: super_admin update all"
  ON public.agents FOR UPDATE
  USING (public.is_super_admin());

-- Super admin can delete any agent
CREATE POLICY "agents: super_admin delete"
  ON public.agents FOR DELETE
  USING (public.is_super_admin());

-- ── properties ───────────────────────────────────────────

-- Public can read properties from approved agents
CREATE POLICY "properties: public read"
  ON public.properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE agents.id = properties.agent_id
        AND agents.status = 'approved'
    )
  );

-- Super admin can read all
CREATE POLICY "properties: super_admin read all"
  ON public.properties FOR SELECT
  USING (public.is_super_admin());

-- Approved agent can insert own listings
CREATE POLICY "properties: agent insert"
  ON public.properties FOR INSERT
  WITH CHECK (
    agent_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.agents
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

-- Agent can update own listings
CREATE POLICY "properties: agent update"
  ON public.properties FOR UPDATE
  USING (agent_id = auth.uid());

-- Agent can delete own listings
CREATE POLICY "properties: agent delete"
  ON public.properties FOR DELETE
  USING (agent_id = auth.uid());

-- Super admin can do anything to properties
CREATE POLICY "properties: super_admin all"
  ON public.properties FOR ALL
  USING (public.is_super_admin());

-- ── inquiries ────────────────────────────────────────────

-- Agent can read own inquiries
CREATE POLICY "inquiries: agent read own"
  ON public.inquiries FOR SELECT
  USING (agent_id = auth.uid());

-- Super admin can read all inquiries
CREATE POLICY "inquiries: super_admin read all"
  ON public.inquiries FOR SELECT
  USING (public.is_super_admin());

-- Agent can update status on own inquiries
CREATE POLICY "inquiries: agent update own"
  ON public.inquiries FOR UPDATE
  USING (agent_id = auth.uid());

-- Insert via service role only (API route) — no direct client insert
-- (No INSERT policy = no authenticated client can insert)

-- ============================================================
-- 5. STORAGE BUCKET
-- Run this separately if the SQL editor can't create buckets.
-- Alternatively create the bucket via the Supabase dashboard:
--   Storage → New Bucket → Name: property-images → Public: ON
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to property-images
CREATE POLICY "storage: authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

-- Allow public read
CREATE POLICY "storage: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Allow owner to delete their own objects
CREATE POLICY "storage: owner delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
