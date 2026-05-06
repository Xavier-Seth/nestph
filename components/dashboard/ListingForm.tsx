"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Property } from "@/types";

const CITIES = ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Other"];
const PROPERTY_TYPES = ["house", "condo", "apartment", "land", "commercial"] as const;
const COMMON_AMENITIES = [
  "Parking", "Swimming Pool", "Security", "CCTV", "Generator",
  "Elevator", "Gym", "Garden", "Balcony", "Storage Room",
];

interface Props {
  action: (formData: FormData) => Promise<void>;
  initial?: Partial<Property>;
  error?: string;
  submitLabel?: string;
}

export function ListingForm({ action, initial, error, submitLabel = "Save Listing" }: Props) {
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [amenityInput, setAmenityInput] = useState("");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 10 - images.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setUploadError(null);

    const results: string[] = [];
    for (const file of toUpload) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setUploadError("Only JPEG, PNG, WebP images allowed.");
        break;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Each file must be 5MB or less.");
        break;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/listings/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setUploadError(json.error ?? "Upload failed.");
        break;
      }
      results.push(json.url);
    }

    setImages((prev) => [...prev, ...results]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function addAmenity(val: string) {
    const trimmed = val.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setAmenityInput("");
  }

  function removeAmenity(a: string) {
    setAmenities((prev) => prev.filter((x) => x !== a));
  }

  const inputClass =
    "h-10 w-full rounded-sm border border-hairline px-3 text-body-md text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  return (
    <form action={action} className="space-y-6">
      {/* Hidden fields for complex state */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="amenities" value={JSON.stringify(amenities)} />
      <input type="hidden" name="featured" value={String(featured)} />

      {error && (
        <div className="px-4 py-3 rounded-sm bg-error/10 border border-error/20 text-body-sm text-error">
          {error === "validation" && "Please check all required fields."}
          {error === "db" && "Failed to save. Please try again."}
        </div>
      )}

      {/* Images */}
      <section>
        <h2 className="text-body-md font-semibold text-ink mb-3">
          Photos <span className="text-body-sm font-normal text-muted">({images.length}/10)</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-sm overflow-hidden bg-surface-soft group">
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-body-sm transition-opacity"
                aria-label="Remove photo"
              >
                Remove
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-sm border-2 border-dashed border-hairline flex flex-col items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50 text-body-sm gap-1"
            >
              {uploading ? "Uploading…" : (<><span className="text-h3">+</span><span>Add photo</span></>)}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        {uploadError && (
          <p className="text-body-sm text-error mt-1">{uploadError}</p>
        )}
        <p className="text-caption text-muted">JPEG, PNG, WebP · max 5MB each · up to 10 photos</p>
      </section>

      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-body-md font-semibold text-ink">Basic Information</h2>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-body-sm font-medium text-ink">
            Title <span className="text-error">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initial?.title}
            placeholder="3BR House in Cebu City near SM"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-body-sm font-medium text-ink">
            Description <span className="text-error">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={initial?.description}
            placeholder="Describe the property…"
            className="w-full rounded-sm border border-hairline px-3 py-2.5 text-body-md text-ink bg-canvas placeholder:text-muted resize-vertical focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="property_type" className="text-body-sm font-medium text-ink">
              Property Type <span className="text-error">*</span>
            </label>
            <select
              id="property_type"
              name="property_type"
              required
              defaultValue={initial?.property_type ?? ""}
              className={inputClass + " cursor-pointer"}
            >
              <option value="" disabled>Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-body-sm font-medium text-ink">
              Status <span className="text-error">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={initial?.status ?? "for_sale"}
              className={inputClass + " cursor-pointer"}
            >
              <option value="for_sale">For Sale</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-body-sm font-medium text-ink">
            Price (₱) <span className="text-error">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min={0}
            step={1}
            defaultValue={initial?.price}
            placeholder="5000000"
            className={inputClass}
          />
        </div>
      </section>

      {/* Specs */}
      <section className="space-y-4">
        <h2 className="text-body-md font-semibold text-ink">Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bedrooms" className="text-body-sm font-medium text-ink">Bedrooms</label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min={0}
              defaultValue={initial?.bedrooms ?? ""}
              placeholder="3"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bathrooms" className="text-body-sm font-medium text-ink">Bathrooms</label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min={0}
              defaultValue={initial?.bathrooms ?? ""}
              placeholder="2"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="area_sqft" className="text-body-sm font-medium text-ink">Area (sqft)</label>
            <input
              id="area_sqft"
              name="area_sqft"
              type="number"
              min={1}
              defaultValue={initial?.area_sqft ?? ""}
              placeholder="120"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-body-md font-semibold text-ink">Location</h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-body-sm font-medium text-ink">
            Street Address <span className="text-error">*</span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            defaultValue={initial?.address}
            placeholder="123 Ayala Ave, Cebu Business Park"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="text-body-sm font-medium text-ink">
              City <span className="text-error">*</span>
            </label>
            <select
              id="city"
              name="city"
              required
              defaultValue={initial?.city ?? ""}
              className={inputClass + " cursor-pointer"}
            >
              <option value="" disabled>Select city</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className="text-body-sm font-medium text-ink">
              State/Region <span className="text-error">*</span>
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              defaultValue={initial?.state ?? "Cebu"}
              placeholder="Cebu"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="zip_code" className="text-body-sm font-medium text-ink">Zip Code</label>
            <input
              id="zip_code"
              name="zip_code"
              type="text"
              defaultValue={initial?.zip_code ?? ""}
              placeholder="6000"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-3">
        <h2 className="text-body-md font-semibold text-ink">Amenities</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {COMMON_AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => amenities.includes(a) ? removeAmenity(a) : addAmenity(a)}
              className={`px-3 py-1 rounded-full text-body-sm border transition-colors ${
                amenities.includes(a)
                  ? "bg-primary text-white border-primary"
                  : "border-hairline text-body hover:border-outline"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(amenityInput); } }}
            placeholder="Add custom amenity…"
            className="flex-1 h-9 rounded-sm border border-hairline px-3 text-body-sm text-ink bg-canvas placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addAmenity(amenityInput)}
            className="h-9 px-3 rounded-sm border border-hairline text-body-sm text-ink hover:bg-surface-soft transition-colors"
          >
            Add
          </button>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span key={a} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-body-sm text-primary">
                {a}
                <button
                  type="button"
                  onClick={() => removeAmenity(a)}
                  className="ml-1 text-muted hover:text-error transition-colors"
                  aria-label={`Remove ${a}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-body-sm font-medium text-ink">Feature this listing on the homepage</span>
        </label>
      </section>

      <div className="pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="h-11 px-8 rounded-sm bg-primary text-white text-body-sm font-medium hover:bg-primary-dark active:bg-primary-active transition-colors duration-150 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
