import { z } from "zod";

export const ListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  property_type: z.enum(["house", "condo", "apartment", "land", "commercial"]),
  status: z.enum(["for_sale", "sold", "pending"]),
  bedrooms: z.coerce.number().int().min(0).nullable().optional(),
  bathrooms: z.coerce.number().int().min(0).nullable().optional(),
  area_sqft: z.coerce.number().int().positive().nullable().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  zip_code: z.string().nullable().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).max(10, "Maximum 10 images").default([]),
  featured: z.boolean().default(false),
});

export type ListingInput = z.infer<typeof ListingSchema>;
