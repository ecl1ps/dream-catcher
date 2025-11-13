interface Window {
  api: {
    setLayout: (layout: string) => void;
    sendSelectedImage: (image: Image) => void;
    onNewImage: (
      callback: (image: {
        dataUrl: string;
        width: number;
        height: number;
      }) => void,
    ) => void;
  };
}
