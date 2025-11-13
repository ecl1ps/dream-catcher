import { useEffect, useState } from "react";
import { Image } from "../models/Image";
import { ImageGallery } from "./ImageGallery";
import { LayoutControls } from "./LayoutControls";

export const ControlPanel = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [displays, setDisplays] = useState<string[]>([]);

  useEffect(() => {
    // Example of listening for new images from the main process
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      if (image) {
        setImages((prevImages) => {
          return prevImages.length === 0 ||
            image.dataUrl != prevImages[prevImages.length - 1].dataUrl // printscreen triggers twice for some reason
            ? [...prevImages, image]
            : prevImages;
        });
      }
    });
    window.api.onDisplayList((displays) => {
      setDisplays(displays);
    });
  }, []);

  return (
    <>
      <div>Content</div>
      <LayoutControls displays={displays} />
      <ImageGallery
        images={images}
        onImageSelect={(image) => window.api.sendSelectedImage(image)}
      />
    </>
  );
};
