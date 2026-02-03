import { useState } from "react";
import { ImageGalleryItem } from "./ImageGalleryItem";

import "./ImageGallery.css";
import { useAppContext } from "./AppContext";

interface ImageGalleryProps {}

export const ImageGallery = ({}: ImageGalleryProps) => {
  const { images, setSelectedImage, removeImage } = useAppContext();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setSelectedImage(images[index]);
  };

  return (
    <div className="image-gallery_wrapper">
      {images.length === 0 && <p>No images available</p>}
      {images.length > 0 && (
        <div className="image-gallery-items_wrapper">
          {images.map((image, index) => (
            <ImageGalleryItem
              key={index}
              image={image}
              isSelected={index === selectedImageIndex}
              onClick={() => handleImageClick(index)}
              onRemove={() => {
                removeImage(image);
                if (index === selectedImageIndex) {
                  setSelectedImageIndex(null);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
