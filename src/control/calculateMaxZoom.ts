import { Image } from "../models/Image";

export function calculateMaxZoom(
  image: Image,
  display: { width: number; height: number },
  isImageSideways: boolean,
) {
  return Math.round(
    Math.min(
      (display.width / (isImageSideways ? image.height : image.width)) *
        0.95 * // fill 95% of the screen
        100,
      (display.height / (isImageSideways ? image.width : image.height)) *
        0.95 * // fill 95% of the screen
        100,
    ),
  );
}
