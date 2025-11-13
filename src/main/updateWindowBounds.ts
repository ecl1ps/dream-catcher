import { type BrowserWindow } from "electron";

export const updateWindowBounds = (
  imageSize: {
    x: number;
    y: number;
    width: number;
    height: number;
    zoom: number;
    rotation: number;
  },
  playerWindow: BrowserWindow,
) => {
  playerWindow.setBounds({
    width: imageSize.width,
    height: imageSize.height,
    x: imageSize.x,
    y: imageSize.y,
  });
};
