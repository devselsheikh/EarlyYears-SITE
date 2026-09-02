import { ASSET_MANIFEST, type AssetEntry } from './assetManifest';

export type ImageSlotKind = 'static' | 'dynamic-profile';

export interface ImageSlot extends AssetEntry {
  localPath: string;
  kind: ImageSlotKind;
}

const DYNAMIC_PROFILE_PREFIXES = [
  'daycare.educator.',
  'daycare.testimonial.',
  'eduhub.alumni.',
];

export function isDynamicProfileSlot(key: string): boolean {
  return DYNAMIC_PROFILE_PREFIXES.some(prefix => key.startsWith(prefix));
}

export function imageSlotPath(key: string): string {
  const brand = key.startsWith('eduhub.') ? 'eduhub' : 'daycare';
  const extension = key === 'daycare.educator.lamia' ? 'png' : 'jpg';
  return `/images/${brand}/${key}.${extension}`;
}

export const IMAGE_SLOTS: Record<string, ImageSlot> = Object.fromEntries(
  Object.entries(ASSET_MANIFEST).map(([key, entry]) => [
    key,
    {
      ...entry,
      localPath: imageSlotPath(key),
      kind: isDynamicProfileSlot(key) ? 'dynamic-profile' : 'static',
    },
  ]),
);

export function getImageSlot(key: string): ImageSlot | null {
  return IMAGE_SLOTS[key] ?? null;
}
