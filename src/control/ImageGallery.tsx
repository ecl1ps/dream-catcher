import { useState } from "react";
import { Image } from "../models/Image";
import { ImageGalleryItem } from "./ImageGalleryItem";

import "./ImageGallery.css";

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
    <div className="image-gallery_wrapper">
      <h2 className="image-gallery_header">Images</h2>
      {images.length === 0 && <p>No images available</p>}
      {images.length > 0 && (
        <div className="image-gallery-items_wrapper">
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
