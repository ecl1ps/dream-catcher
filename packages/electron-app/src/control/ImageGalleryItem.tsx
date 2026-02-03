import { Trash } from "../icons/Trash";
import { Image } from "../types/Image";
import { IconButton } from "./IconButton";
import "./ImageGalleryItem.css";

type ImageGalleryItemProps = {
  image: Image;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
};

export const ImageGalleryItem = ({
  image,
  isSelected,
  onClick,
  onRemove,
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
      <div className="image-gallery-item_controls">
        <IconButton
          className="image-gallery-item_remove-button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash />
        </IconButton>
      </div>
    </div>
  );
};
