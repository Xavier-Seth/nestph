"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? 0 : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );
  const nextPhoto = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? 0 : (i + 1) % images.length
      ),
    [images.length]
  );

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-md bg-surface-soft border border-hairline flex items-center justify-center">
        <svg
          className="w-16 h-16 text-hairline"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path d="M9 22V12h6v10" />
        </svg>
      </div>
    );
  }

  const primary = images[0];
  const thumbnails = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-[420px] rounded-md overflow-hidden">
        {/* Primary large image */}
        <button
          onClick={() => openLightbox(0)}
          className="col-span-2 row-span-2 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          aria-label={`View photo 1 of ${images.length}`}
        >
          <Image
            src={primary}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </button>

        {/* Thumbnails */}
        {thumbnails.map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i + 1)}
            className="relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            aria-label={`View photo ${i + 2} of ${images.length}`}
          >
            <Image
              src={img}
              alt={`${title} — photo ${i + 2}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="25vw"
            />
            {/* "View all" overlay on last thumbnail when there are more */}
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-body-md">
                  +{remaining + 1} photos
                </span>
              </div>
            )}
          </button>
        ))}

        {/* Fill empty thumbnail slots if fewer than 4 thumbs */}
        {thumbnails.length < 4 &&
          Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-surface-soft"
              aria-hidden="true"
            />
          ))}
      </div>

      {/* View all link */}
      {images.length > 1 && (
        <button
          onClick={() => openLightbox(0)}
          className="mt-2 text-body-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          View all {images.length} photos
        </button>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}
