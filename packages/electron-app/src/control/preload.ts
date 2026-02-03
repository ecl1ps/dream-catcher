/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { contextBridge, ipcRenderer } from "electron";
import { Layout } from "../types/Layout";
import { Display } from "../types/Display";
import { Image } from "../types/Image";
import { ViewType } from "../types/ViewType";

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
  sendTextContent: (text: string) =>
    port?.postMessage({ type: "text-content", payload: text }),
  sendSelectedDisplay: (display: string) =>
    ipcRenderer.send("selected-display", display),
  sendShowPlayer: (isShown: boolean) =>
    ipcRenderer.send("show-player", isShown),
  sendShowBackground: (isShown: boolean) =>
    port?.postMessage({ type: "show-background", payload: isShown }),
  sendSelectedView: (view: ViewType) =>
    port?.postMessage({ type: "selected-view", payload: view }),
  sendPinnedWindow: (isPinned: boolean) =>
    ipcRenderer.send("pinned-window", isPinned),
  onNewImage: (callback: (data: Image) => void) => {
    ipcRenderer.on("new-image", (event, image: Image) => callback(image));
  },
  onDisplayList: (callback: (displays: Display[]) => void) => {
    ipcRenderer.on("display-list", (event, data) => callback(data));
  },
});
