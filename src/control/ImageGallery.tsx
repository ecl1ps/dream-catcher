import { useState } from "react";
import { Image } from "../models/Image";
import { ImageGalleryItem } from "./ImageGalleryItem";

type ImageGalleryProps = {
  images: Image[];
  onImageSelect: (image: Image) => void;
};

export const ImageGallery = ({ images, onImageSelect }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    onImageSelect(images[index]);
  };

  return (
    <div>
      <h2>Images Component</h2>
      {images.length === 0 && <p>No images available</p>}
      {images.length > 0 && (
        <div style={{ display: "grid" }}>
          {images.map((image, index) => (
            <ImageGalleryItem
              key={index}
              image={image}
              isSelected={index === selectedImageIndex}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
