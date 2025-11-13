interface Window {
  api: {
    setLayout: (layout: Layout) => void;
    sendSelectedImage: (image: Image) => void;
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
