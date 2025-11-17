//import { Layout } from "./models/Layout";
//import { Image } from "./models/Image";
//import { Display } from "./models/Display";

interface Window {
  api: {
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
    onLayoutUpdate: (callback: (layout: Layout) => void) => void;
  };
}
