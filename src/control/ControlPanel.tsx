import { useEffect, useState } from "react";
import { Image } from "../models/Image";
import { ImageGallery } from "./ImageGallery";
import { LayoutControls } from "./LayoutControls";

export const ControlPanel = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    // Example of listening for new images from the main process
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      setImages((prevImages) => [...prevImages, image]);
    });
  }, []);

  return (
    <>
      <div>Content</div>
      <LayoutControls />
      <ImageGallery
        images={images}
        onImageSelect={(image) => window.api.sendSelectedImage(image)}
      />
    </>
  );
};
