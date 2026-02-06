/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { contextBridge, ipcRenderer } from "electron";
import type { Layout } from "../types/Layout";
import type { Display } from "../types/Display";
import type { Image } from "../types/Image";
import type { ViewType } from "../types/ViewType";

let port: MessagePort | null = null;

const registeredCallbacks = {};

console.log("Preload script loaded");

ipcRenderer.on("port", (e) => {
  port = e.ports[0];

  console.log("Port received in preload");

  port.onmessage = (messageEvent) => {};
});

// Signal to main process that the preload script is ready
window.addEventListener("DOMContentLoaded", () => {
  console.log("Control renderer DOM loaded, signaling ready");
  ipcRenderer.send("control-ready");
});

contextBridge.exposeInMainWorld("api", {
  sendSelectedLayout: (layout: Layout) =>
    port?.postMessage({ type: "selected-layout", payload: layout }),
  sendSelectedImage: (image: Image) =>
    port?.postMessage({ type: "selected-image", payload: image }),
  sendTextContent: (text: string) => port?.postMessage({ type: "text-content", payload: text }),
  sendSelectedDisplay: (display: string) => ipcRenderer.send("selected-display", display),
  sendShowPlayer: (isShown: boolean) => ipcRenderer.send("show-player", isShown),
  sendShowBackground: (isShown: boolean) =>
    port?.postMessage({ type: "show-background", payload: isShown }),
  sendSelectedView: (view: ViewType) => port?.postMessage({ type: "selected-view", payload: view }),
  sendPinnedWindow: (isPinned: boolean) => ipcRenderer.send("pinned-window", isPinned),
  onNewImage: (callback: (data: Image) => void) => {
    console.log("Registering onNewImage callback");
    ipcRenderer.on("new-image", (event, image: Image) => {
      console.log("New image received:", image);
      callback(image);
    });
  },
  onDisplayList: (callback: (displays: Display[]) => void) => {
    console.log("Registering onDisplayList callback");
    ipcRenderer.on("display-list", (event, data) => {
      console.log("Display list received:", data);
      callback(data);
    });
  },
});