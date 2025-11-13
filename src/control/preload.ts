// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Image } from "../models/Image";

contextBridge.exposeInMainWorld("api", {
  sendWindowReady: () => ipcRenderer.send("window-ready"),
  sendSelectedLayout: (layout: string) =>
    ipcRenderer.send("selected-layout", layout),
  sendSelectedImage: (image: Image) =>
    ipcRenderer.send("selected-image", image),
  sendSelectedDisplay: (display: string) =>
    ipcRenderer.send("selected-display", display),
  onNewImage: (callback: (data: Image) => void) => {
    ipcRenderer.on("new-image", (event, data) => callback(data));
  },
  onDisplayList: (callback: (displays: string[]) => void) => {
    ipcRenderer.on("display-list", (event, data) => callback(data));
  },
});
