export type AgentStatus = "pending" | "approved" | "suspended";
export type AgentRole = "agent" | "super_admin";
export type PropertyStatus = "for_sale" | "sold" | "pending";
export type PropertyType = "house" | "condo" | "apartment" | "land" | "commercial";
export type InquiryStatus = "new" | "read" | "replied";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  years_experience: number;
  fb_username: string | null;
  status: AgentStatus;
  role: AgentRole;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  price: number;
  property_type: PropertyType;
  status: PropertyStatus;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  images: string[];
  amenities: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  agent?: Agent;
}

export interface Inquiry {
  id: string;
  property_id: string | null;
  agent_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  recaptcha_score: number | null;
  status: InquiryStatus;
  created_at: string;
  property?: Pick<Property, "id" | "title" | "images">;
}

export interface PropertyFilters {
  city?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: PropertyStatus;
  featured?: boolean;
  sort?: "newest" | "price_high" | "price_low";
}

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
  listings?: Pick<Property, "id" | "title" | "price" | "city" | "images" | "bedrooms" | "bathrooms">[];
  timestamp: Date;
}
