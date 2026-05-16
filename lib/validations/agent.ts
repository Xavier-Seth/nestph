import { z } from "zod";

const PH_PHONE_RE = /^(\+639|09)\d{9}$/;

export const AgentProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z.preprocess(
    (v) => (typeof v === "string" && v.trim() ? v.trim() : null),
    z
      .string()
      .regex(
        PH_PHONE_RE,
        "Enter a valid Philippine number (+63XXXXXXXXXX or 09XXXXXXXXXX)"
      )
      .nullable()
  ),
  bio: z.preprocess(
    (v) => (typeof v === "string" && v.trim() ? v.trim() : null),
    z.string().max(500, "Bio cannot exceed 500 characters").nullable()
  ),
  years_experience: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      return isNaN(n) ? null : n;
    },
    z.number().int().min(0, "Must be 0 or more").max(50, "Cannot exceed 50 years").nullable()
  ),
  fb_username: z.preprocess(
    (v) => (typeof v === "string" && v.trim() ? v.trim() : null),
    z
      .string()
      .max(50, "Facebook username cannot exceed 50 characters")
      .regex(/^[^\s@]+$/, "No spaces or @ symbol allowed")
      .nullable()
  ),
});

export type AgentProfileInput = z.infer<typeof AgentProfileSchema>;
