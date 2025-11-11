import { ipcMain, type BrowserWindow } from "electron";
import { setLayout } from "./setLayout";

export function setupIpc(
  controlWindow: BrowserWindow,
  playerWindow: BrowserWindow,
) {
  ipcMain.on("set-layout", (event, layout) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    setLayout(layout, playerWindow);
  });
  ipcMain.emit("new-image", { data: "image-data" });
}
