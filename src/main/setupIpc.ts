import { clipboard, ipcMain, screen, type BrowserWindow } from "electron";
import { updateWindowBounds } from "./updateWindowBounds";
import ClipboardListener from "../clipboard-event/index";
import { Image } from "../models/Image";
import { Layout } from "../models/Layout";
import { computePlayerConfig } from "./computePlayerConfig";
import { preselectDisplay } from "./preselectDisplay";

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
  ipcMain.on("selected-display", (_, displayLabel: string) => {
    const display = screen
      .getAllDisplays()
      .find((d) => d.label === displayLabel);

    if (display) {
      playerWindow.setBounds(display.bounds);

      const newConfig = computePlayerConfig(
        context.layout,
        context.imageSize,
        playerWindow,
      );

      console.log("New player config:", newConfig);

      updateWindowBounds(newConfig, playerWindow);
    }
  });

  ipcMain.on("selected-layout", (_, layout: Layout) => {
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

  ipcMain.on("selected-image", (_, image: Image) => {
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

  ipcMain.on("window-ready", () => {
    const preselectedDisplay = preselectDisplay(screen.getAllDisplays());
    controlWindow.webContents.send(
      "display-list",
      screen.getAllDisplays().map((d) => ({
        name: d.label,
        width: d.workAreaSize.width,
        height: d.workAreaSize.height,
        isPreselected: preselectedDisplay.id === d.id,
      })),
    );
  });
}
