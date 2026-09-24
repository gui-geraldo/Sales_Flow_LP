"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Placeholder-aware media tile: renders a photo or a short looping video
// (native <video>, muted/autoplay/loop, no player chrome) once real files
// exist, and falls back to a dashed placeholder box until then.
//
// Loading: files in /public/team are already pre-optimized (720×720 JPG,
// ~100 KB), so images skip the next/image optimizer (`unoptimized`) and come
// straight from the static CDN — no on-demand processing delay. Photos and
// posters load eagerly at low priority; videos start on whichever comes
// first: window load, or MEDIA_WARMUP_EVENT (fired by the section when its
// stats row scrolls into view).
export const MEDIA_WARMUP_EVENT = "sf:media-warmup";

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
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          unoptimized
          loading="eager"
          fetchPriority="low"
          className="object-cover"
        />
      </figure>
    );
  }

  return <VideoTile src={src} poster={poster} className={wrapperClass} />;
}

function VideoTile({ src, poster, className }: { src: string; poster?: string; className: string }) {
  const [ready, setReady] = useState(false);

  // Viewport-based lazy loading doesn't work here: inside the overflow-hidden
  // marquee, off-screen tiles never "intersect" until they are already
  // visible. So the video mounts on page load or on the section's warm-up
  // signal, whichever happens first.
  useEffect(() => {
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }
    const start = () => setReady(true);
    window.addEventListener("load", start, { once: true });
    window.addEventListener(MEDIA_WARMUP_EVENT, start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.removeEventListener(MEDIA_WARMUP_EVENT, start);
    };
  }, []);

  // The poster shows straight away, so the tile is never an empty box; the
  // video mounts on top of it once it's allowed to start.
  return (
    <div className={`${className} bg-gray-900`}>
      {poster && (
        <Image src={poster} alt="" fill unoptimized loading="eager" fetchPriority="low" className="object-cover" />
      )}
      {ready && (
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
