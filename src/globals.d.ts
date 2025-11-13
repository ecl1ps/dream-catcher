//import { Layout } from "./models/Layout";
//import { Image } from "./models/Image";
//import { Display } from "./models/Display";

interface Window {
  api: {
    sendWindowReady: () => void;
    sendSelectedDisplay: (display: string) => void;
    sendSelectedLayout: (layout: Layout) => void;
    sendSelectedImage: (image: Image) => void;
    onDisplayList: (callback: (displays: Display[]) => void) => void;
    onNewImage: (
      callback: (image: {
        dataUrl: string;
        width: number;
        height: number;
      }) => void,
    ) => void;
    onImageConfigUpdate: (
      callback: (config: { zoom: number; rotation: number }) => void,
    ) => void;
  };
}
