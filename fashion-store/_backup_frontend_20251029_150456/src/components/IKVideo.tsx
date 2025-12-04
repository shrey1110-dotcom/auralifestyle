// src/components/IKVideo.tsx
import React from "react";
import { ikVideo } from "@/lib/ik";


type Props = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  transform?: string; // e.g., "h-720,q-70,f-auto"
};

export default function IKVideo({
  src,
  transform = "h-720,q-70,f-auto",
  preload = "metadata",
  playsInline = true,
  ...rest
}: Props) {
  const url = ikVideo(src, transform);
  return <video src={url} preload={preload} playsInline={playsInline} {...rest} />;
}
