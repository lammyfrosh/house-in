"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type PropertyGalleryProps = {
  title: string;
  images: string[];
};

export default function PropertyGallery({
  title,
  images,
}: PropertyGalleryProps) {
  const safeImages = useMemo(() => {
    const filtered = (images || []).filter(Boolean);
    return filtered.length > 0
      ? filtered
      : ["/placeholder-property.jpg"];
  }, [images]);

  const [activeImage, setActiveImage] = useState<string>(safeImages[0]);

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="relative h-[280px] overflow-hidden rounded-2xl bg-slate-100 sm:h-[360px]">
        <Image
          src={activeImage}
          alt={title}
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-max gap-3 pb-1">
            {safeImages.map((image, index) => {
              const active = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative h-24 w-32 overflow-hidden rounded-2xl border-2 transition ${
                    active
                      ? "border-[var(--color-primary-dark)] ring-2 ring-[var(--color-primary)]/20"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} gallery ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}