import { Image } from "../models/Image";
import "./ImageGalleryItem.css";

type ImageGalleryItemProps = {
  image: Image;
  isSelected: boolean;
  onClick: () => void;
};

export const ImageGalleryItem = ({
  image,
  isSelected,
  onClick,
}: ImageGalleryItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`image-gallery-item_wrapper ${isSelected ? "image-gallery-item_selected" : ""}`}
    >
      <img
        src={image.dataUrl}
        alt={`Image Width: ${image.width}px Height: ${image.height}px`}
      />
    </div>
  );
};
