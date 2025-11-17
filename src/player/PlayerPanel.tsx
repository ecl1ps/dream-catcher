import { useEffect, useState } from "react";
import { Layout } from "../models/Layout";
import { Image } from "../models/Image";

export const PlayerPanel = () => {
  const [image, setImage] = useState<Image>(null);
  const [layout, setLayout] = useState<Layout>({
    type: "center",
    zoom: 100,
    rotation: 0,
  });

  useEffect(() => {
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      setImage(image);
    });
    window.api.onLayoutUpdate((layout) => {
      console.log("Received layout update:", layout);
      setLayout(layout);
    });
  }, []);

  if (!image) return null;

  const translate = computeTranslation(layout);

  return (
    <img
      src={image.dataUrl}
      style={{
        transformOrigin: "center center",
        transform: `translate(-50%, -50%) rotate(${layout.rotation}deg) scale(${layout.zoom / 100})`,
        translate,
        transition: "transform 0.3s ease, translate 0.3s ease",
      }}
    />
  );
};

function computeTranslation(layout: Layout) {
  switch (layout.type) {
    case "left-third":
      return `33vw 50vh`;
    case "right-third":
      return `67vw 50vh`;
    case "custom":
      return `min(max(${layout.offset.x}vw, 50%), calc(${layout.offset.x}vw - 50%)) min(max(${layout.offset.y}vh, 50%), calc(${layout.offset.y}vh - 50%))`;
    case "center":
    case "fullscreen":
    default:
      return `50vw 50vh`;
  }
}
