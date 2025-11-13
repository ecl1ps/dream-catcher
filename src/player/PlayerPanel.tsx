import { useEffect, useState } from "react";
import { Image } from "../models/Image";

export const PlayerPanel = () => {
  const [image, setImage] = useState<Image>(null);
  const [config, setConfig] = useState<{ zoom: number; rotation: number }>({
    zoom: 100,
    rotation: 0,
  });

  useEffect(() => {
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      setImage(image);
    });
    window.api.onImageConfigUpdate((config) => {
      console.log("Received image config update:", config);
      // Handle zoom and rotation updates if needed
      setConfig(config);
    });
  }, []);

  if (!image) return null;

  return (
    <img
      src={image.dataUrl}
      style={{
        maxWidth: "100vw",
        maxHeight: "100vh",
        transform: `scale(${config.zoom / 100}) rotate(${config.rotation}deg)`,
      }}
    />
  );
};
