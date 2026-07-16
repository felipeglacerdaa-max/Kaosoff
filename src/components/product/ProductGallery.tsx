"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] bg-mist overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — foto ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors duration-300",
                i === activeIndex ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} — miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
