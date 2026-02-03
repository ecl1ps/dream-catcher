/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { contextBridge, ipcRenderer } from "electron";
import { Layout } from "../types/Layout";
import { Image } from "../types/Image";
import { ViewType } from "../types/ViewType";

let port: MessagePort | null = null;

const registeredCallbacks = {
  onNewImage: (data: Image) => {},
  onLayoutUpdate: (layout: Layout) => {},
  onBackgroundToggle: (isShown: boolean) => {},
  onTextContent: (text: string) => {},
  onSelectedView: (view: ViewType) => {},
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
      case "show-background":
        registeredCallbacks.onBackgroundToggle(messageEvent.data.payload);
        break;
      case "text-content":
        registeredCallbacks.onTextContent(messageEvent.data.payload);
        break;
      case "selected-view":
        registeredCallbacks.onSelectedView(messageEvent.data.payload);
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
  onBackgroundToggle: (callback: (isShown: boolean) => void) => {
    registeredCallbacks.onBackgroundToggle = callback;
  },
  onTextContent: (callback: (text: string) => void) => {
    registeredCallbacks.onTextContent = callback;
  },
  onSelectedView: (callback: (view: ViewType) => void) => {
    registeredCallbacks.onSelectedView = callback;
  },
});
