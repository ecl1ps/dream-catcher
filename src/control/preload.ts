/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { contextBridge, ipcRenderer } from "electron";
import { Layout } from "../models/Layout";
import { Display } from "../models/Display";
import { Image } from "../models/Image";

let port: MessagePort | null = null;

const registeredCallbacks = {};

ipcRenderer.on("port", (e) => {
  port = e.ports[0];

  port.onmessage = (messageEvent) => {};
});

contextBridge.exposeInMainWorld("api", {
  sendSelectedLayout: (layout: Layout) =>
    port?.postMessage({ type: "selected-layout", payload: layout }),
  sendSelectedImage: (image: Image) =>
    port?.postMessage({ type: "selected-image", payload: image }),
  sendSelectedDisplay: (display: string) =>
    ipcRenderer.send("selected-display", display),
  onNewImage: (callback: (data: Image) => void) => {
    ipcRenderer.on("new-image", (event, image: Image) => callback(image));
  },
  onDisplayList: (callback: (displays: Display[]) => void) => {
    ipcRenderer.on("display-list", (event, data) => callback(data));
  },
});
