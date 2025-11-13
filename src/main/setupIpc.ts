import { clipboard, ipcMain, type BrowserWindow } from "electron";
import { setLayout } from "./setLayout";
import ClipboardListener from "../clipboard-event/index";
import { Image } from "../models/Image";

export function setupIpc(
  controlWindow: BrowserWindow,
  playerWindow: BrowserWindow,
) {
  ipcMain.on("set-layout", (event, layout) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    setLayout(layout, playerWindow);
  });

  ipcMain.on("send-selected-image", (event, image) => {
    playerWindow.webContents.send("new-image", image);
  });

  console.log("Starting clipboard listener...");
  ClipboardListener.startListening();

  ClipboardListener.on("change", async () => {
    const text = clipboard.readText();
    const image = clipboard.readImage();

    console.log("Clipboard changed:", text, image);

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
