"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Placeholder-aware media tile: renders a photo (next/image) or a short
// looping video (native <video>, muted/autoplay/loop, no player chrome)
// once real files exist, and falls back to a dashed placeholder box until
// then. Video only starts fetching once it scrolls near the viewport
// (IntersectionObserver), so a page full of these never front-loads bytes
// nobody has scrolled to yet.
type MediaClipProps = {
  type: "photo" | "video";
  src?: string;
  poster?: string;
  alt?: string;
  label: string;
  caption: string;
  className?: string;
};

export function MediaClip({ type, src, poster, alt, label, caption, className }: MediaClipProps) {
  const wrapperClass = `relative aspect-square overflow-hidden rounded-lg border border-white/10 ${className ?? ""}`;

  if (!src) {
    return (
      <figure
        className={`${wrapperClass} flex flex-col items-center justify-center gap-2 border-dashed bg-white/[0.02] p-4 text-center`}
      >
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <p className="text-xs leading-snug text-gray-500">{caption}</p>
      </figure>
    );
  }

  if (type === "photo") {
    return (
      <figure className={`${wrapperClass} bg-gray-900`}>
        <Image src={src} alt={alt ?? ""} fill sizes="(min-width: 640px) 340px, 62vw" className="object-cover" />
      </figure>
    );
  }

  return <VideoTile src={src} poster={poster} className={wrapperClass} />;
}

function VideoTile({ src, poster, className }: { src: string; poster?: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The poster renders through next/image straight away (optimized, same
  // lazy loading as the photos), so the tile is never an empty box; the
  // video mounts on top of it once near the viewport.
  return (
    <div ref={ref} className={`${className} bg-gray-900`}>
      {poster && (
        <Image src={poster} alt="" fill sizes="(min-width: 640px) 340px, 62vw" className="object-cover" />
      )}
      {inView && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
}
