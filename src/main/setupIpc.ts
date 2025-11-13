import { clipboard, ipcMain, type BrowserWindow } from "electron";
import { updateWindowBounds } from "./updateWindowBounds";
import ClipboardListener from "../clipboard-event/index";
import { Image } from "../models/Image";
import { Layout } from "../models/Layout";
import { computePlayerConfig } from "./computePlayerConfig";

type Context = {
  layout: Layout;
  imageSize: { width: number; height: number };
};

const context: Context = {
  layout: { type: "center", zoom: 100, rotation: 0 },
  imageSize: { width: 800, height: 600 },
};

export function setupIpc(
  controlWindow: BrowserWindow,
  playerWindow: BrowserWindow,
) {
  ipcMain.on("set-layout", (_, layout: Layout) => {
    context.layout = layout;

    const newConfig = computePlayerConfig(
      context.layout,
      context.imageSize,
      playerWindow,
    );

    console.log("New player config:", newConfig);

    updateWindowBounds(newConfig, playerWindow);

    playerWindow.webContents.send("update-image-config", {
      zoom: newConfig.zoom,
      rotation: newConfig.rotation,
    });
  });

  ipcMain.on("send-selected-image", (_, image: Image) => {
    context.imageSize = { width: image.width, height: image.height };

    const newConfig = computePlayerConfig(
      context.layout,
      context.imageSize,
      playerWindow,
    );

    console.log("New player config on image select:", newConfig);

    updateWindowBounds(newConfig, playerWindow);

    playerWindow.webContents.send("update-image-config", {
      zoom: newConfig.zoom,
      rotation: newConfig.rotation,
    });

    playerWindow.webContents.send("new-image", image);
  });

  ClipboardListener.startListening();

  ClipboardListener.on("change", async () => {
    const image = clipboard.readImage();

    console.log("Clipboard changed");

    if (image && !image.isEmpty()) {
      const dto: Image = {
        dataUrl: image.toDataURL(),
        width: image.getSize().width,
        height: image.getSize().height,
      };
      controlWindow.webContents.send("new-image", dto);
    }
  });
}
