import { type BrowserWindow, screen } from "electron";
import { Layout } from "../models/Layout";

export const computePlayerConfig = (
  layout: Layout,
  imageSize: { width: number; height: number },
  playerWindow: BrowserWindow,
) => {
  const display = screen.getDisplayMatching(playerWindow.getBounds()).workArea;

  const { type, rotation, zoom } = layout;

  switch (type) {
    case "fullscreen":
      return {
        x: display.x,
        y: display.y,
        width: display.width,
        height: display.height,
        zoom,
        rotation,
      };
    case "custom":
      return {
        x: display.x + layout.offset.x,
        y: display.y + layout.offset.y,
        width: imageSize.width,
        height: imageSize.height,
        zoom,
        rotation,
      };
    default:
      return {
        x: display.x,
        y: display.y,
        width: imageSize.width,
        height: imageSize.height,
        zoom,
        rotation,
      };
  }
};
