"use client";

import { useEffect, useMemo, useState } from "react";
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
    const cleaned = (images || []).filter(Boolean);
    return cleaned.length > 0 ? cleaned : ["/placeholder-property.jpg"];
  }, [images]);

  const [activeImage, setActiveImage] = useState<string>(safeImages[0]);

  useEffect(() => {
    setActiveImage(safeImages[0]);
  }, [safeImages]);

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-5">
      <div className="relative h-[360px] overflow-hidden rounded-2xl bg-slate-100 sm:h-[430px] xl:h-[500px]">
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
              const isActive = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative h-24 w-32 overflow-hidden rounded-2xl border-2 transition sm:h-28 sm:w-36 ${
                    isActive
                      ? "border-[var(--color-primary-dark)] ring-2 ring-[var(--color-primary)]/20"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${title} image ${index + 1}`}
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