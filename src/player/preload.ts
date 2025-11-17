/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { contextBridge, ipcRenderer } from "electron";
import { Layout } from "../models/Layout";
import { Image } from "../models/Image";

let port: MessagePort | null = null;

const registeredCallbacks = {
  onNewImage: (data: Image) => {},
  onLayoutUpdate: (layout: Layout) => {},
};

ipcRenderer.on("port", (e) => {
  port = e.ports[0];

  port.onmessage = (messageEvent) => {
    switch (messageEvent.data.type) {
      case "selected-image":
        registeredCallbacks.onNewImage(messageEvent.data.payload);
        break;
      case "selected-layout":
        registeredCallbacks.onLayoutUpdate(messageEvent.data.payload);
        break;
    }
  };
});

contextBridge.exposeInMainWorld("api", {
  onNewImage: (callback: (data: Image) => void) => {
    registeredCallbacks.onNewImage = callback;
  },
  onLayoutUpdate: (callback: (layout: Layout) => void) => {
    registeredCallbacks.onLayoutUpdate = callback;
  },
});
