// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Image } from "../models/Image";

contextBridge.exposeInMainWorld("api", {
  setLayout: (layout: string) => ipcRenderer.send("set-layout", layout),
  sendSelectedImage: (image: Image) =>
    ipcRenderer.send("send-selected-image", image),
  onNewImage: (callback: (data: Image) => void) => {
    ipcRenderer.on("new-image", (event, data) => callback(data));
  },
});
