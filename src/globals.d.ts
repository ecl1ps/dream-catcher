//import { Layout } from "./models/Layout";
//import { Image } from "./models/Image";
//import { Display } from "./models/Display";
// import { ViewType } from "./models/ViewType";

interface Window {
  api: {
    sendSelectedDisplay: (display: string) => void;
    sendSelectedLayout: (layout: Layout) => void;
    sendSelectedImage: (image: Image) => void;
    sendShowPlayer: (isShown: boolean) => void;
    sendShowBackground: (isShown: boolean) => void;
    sendPinnedWindow: (isPinned: boolean) => void;
    sendTextContent: (text: string) => void;
    sendSelectedView: (view: ViewType) => void;

    onDisplayList: (callback: (displays: Display[]) => void) => void;
    onNewImage: (
      callback: (image: {
        dataUrl: string;
        width: number;
        height: number;
      }) => void,
    ) => void;
    onTextContent: (callback: (text: string) => void) => void;
    onLayoutUpdate: (callback: (layout: Layout) => void) => void;
    onBackgroundToggle: (callback: (isShown: boolean) => void) => void;
    onSelectedView: (callback: (view: ViewType) => void) => void;
  };
}
