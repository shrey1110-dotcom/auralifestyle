// src/lib/ik.ts
const IK_BASE = import.meta.env.VITE_IK_BASE ?? "";

export function ik(
  path: string,
  { w = 800, q = 85, extra }: { w?: number; q?: number; extra?: string } = {}
) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const tr = extra ?? `f-auto,q-${q},w-${w}`;
  return `${IK_BASE}${encodeURI(p)}?tr=${tr}`;
}

export function ikSrcSet(
  path: string,
  widths: number[] = [320, 480, 640, 768, 960, 1200, 1600],
  q = 85
) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return widths
    .map((w) => `${IK_BASE}${encodeURI(p)}?tr=f-auto,q-${q},w-${w} ${w}w`)
    .join(", ");
}

// Optional video helper
export function ikVideo(path: string, tr = "h-720,q-70,f-auto") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${IK_BASE}${encodeURI(p)}?tr=${tr}`;
}
