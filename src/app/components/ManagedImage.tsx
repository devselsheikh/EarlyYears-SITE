// ─────────────────────────────────────────────────────────────────────────────
// ManagedImage — serves images from the local image registry.
//
// Resolution order:
//   1. localImageRegistry entry for assetKey  (embedded, instant, offline-safe)
//   2. src prop                               (raw URL fallback)
//   3. SVG placeholder                        (never a broken image)
//
// No Supabase queries. No signed URLs. No async fetching.
// Images are replaced by updating localImageRegistry.ts and republishing.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, ImgHTMLAttributes } from 'react';
import { getRegistryEntry } from '../data/localImageRegistry';
import { getImageSlot } from '../data/imageSlots';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImage%3C/text%3E%3C/svg%3E";

export interface ManagedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Semantic asset key (e.g. "daycare.hero") — looked up in localImageRegistry */
  assetKey?: string;
  /** Raw URL or imported image — used when assetKey is absent or not in registry */
  src?: string;
  alt: string;
  /**
   * CSS object-position override for focal point.
   * Omit to use the registry focal point for the asset key.
   */
  focalPoint?: string;
  /**
   * Breakpoint below which the mobile <source> applies.
   * @default "(max-width: 767px)"
   */
  mobileBreakpoint?: string;
}

export default function ManagedImage({
  assetKey,
  src: srcProp,
  alt,
  focalPoint,
  mobileBreakpoint = '(max-width: 767px)',
  className = '',
  style,
  loading = 'lazy',
  ...rest
}: ManagedImageProps) {
  const entry = assetKey ? getRegistryEntry(assetKey) : null;
  const slot = assetKey ? getImageSlot(assetKey) : null;

  const focalX = entry?.focalX ?? 0.5;
  const focalY = entry?.focalY ?? 0.5;
  const objectPosition = focalPoint ?? `${focalX * 100}% ${focalY * 100}%`;

  const dynamicProfileSrc = slot?.kind === 'dynamic-profile' ? srcProp : undefined;
  const localSlotSrc = slot?.localPath;
  const desktopSrc = dynamicProfileSrc ?? localSlotSrc ?? entry?.desktop ?? srcProp ?? PLACEHOLDER;
  const mobileSrc = dynamicProfileSrc ? null : (entry?.mobile ?? null);
  const hasSeparateMobile = mobileSrc !== null && mobileSrc !== desktopSrc;

  const [failed, setFailed] = useState(false);
  const fallbackSrc = localSlotSrc && localSlotSrc !== desktopSrc
    ? localSlotSrc
    : (entry?.desktop ?? srcProp ?? PLACEHOLDER);
  const currentSrc = failed ? fallbackSrc : desktopSrc;

  const handleError = useCallback(() => { setFailed(true); }, []);

  const imgStyle: React.CSSProperties = { objectPosition, ...style };

  const img = (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={imgStyle}
      onError={handleError}
      loading={loading}
      decoding="async"
      {...rest}
    />
  );

  if (!hasSeparateMobile) return img;

  return (
    <picture>
      <source media={mobileBreakpoint} srcSet={mobileSrc!} />
      {img}
    </picture>
  );
}
