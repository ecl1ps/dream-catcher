import { useEffect, useState } from "react";
import { Image } from "../models/Image";

export const PlayerPanel = () => {
  const [image, setImage] = useState<Image>(null);

  useEffect(() => {
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      setImage(image);
    });
  }, []);

  if (!image) return null;

  return <img src={image.dataUrl} style={{ width: "100%" }} />;
};
