import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Display } from "../models/Display";
import { Image } from "../models/Image";
import { calculateMaxZoom } from "./calculateMaxZoom";

interface AppState {
  images: Image[];
  displays: Display[] | null;
  isPlayerShown: boolean;
  selectedImage: Image | null;
  display: { name: string; width: number; height: number };
  layout: string;
  zoom: number;
  rotation: number;
  offset: { x: number; y: number };
  isPinned: boolean;
}

interface AppActions {
  onImageSelect: (image: Image) => void;
  onImageRemove: (image: Image) => void;
  onPinnedChanged: (pinned: boolean) => void;
  onPlayerVisibilityChange: (isShown: boolean) => void;
  onSelectedDisplayChange: (displayName: string) => void;

  setLayout: React.Dispatch<React.SetStateAction<string>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

interface AppContextType extends AppState, AppActions {}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // ControlPanel state
  const [images, setImages] = useState<Image[]>([]);
  const [displays, setDisplays] = useState<Display[] | null>(null);
  const [isPlayerShown, setIsPlayerShown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // LayoutControls state
  const [display, setDisplay] = useState({ name: "", width: 0, height: 0 });
  const [layout, setLayout] = useState("center");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [isPinned, setIsPinned] = useState(false);

  const isImageSideways = rotation % 180 !== 0;

  useEffect(() => {
    // Example of listening for new images from the main process
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      if (image) {
        setImages((prevImages) => {
          return prevImages.length === 0 ||
            image.dataUrl != prevImages[prevImages.length - 1].dataUrl // printscreen triggers twice for some reason
            ? [...prevImages, image]
            : prevImages;
        });
      }
    });
    window.api.onDisplayList((displays) => {
      setDisplays(displays);
    });
  }, []);

  useEffect(() => {
    if (displays) {
      setDisplay(displays.find((d) => d.isPreselected));
    }
  }, [displays]);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    if (
      (isImageSideways ? selectedImage.height : selectedImage.width) >
        display.width ||
      (isImageSideways ? selectedImage.width : selectedImage.height) >
        display.height
    ) {
      setZoom(calculateMaxZoom(selectedImage, display, isImageSideways));
    } else {
      setZoom(100);
    }
  }, [display, isImageSideways, selectedImage]);

  useEffect(() => {
    console.log("Sending layout change:", { layout, zoom, rotation, offset });
    window.api.sendSelectedLayout({ type: layout, zoom, rotation, offset });
  }, [layout, zoom, rotation, offset]);

  const onPinnedChanged = (pinned: boolean) => {
    setIsPinned(pinned);
    window.api.sendPinnedWindow(pinned);
  };

  const onPlayerVisibilityChange = (isShown: boolean) => {
    setIsPlayerShown(isShown);
    window.api.sendShowPlayer(isShown);
  };

  const onSelectedDisplayChange = (displayName: string) => {
    setDisplay(displays.find((d) => d.name === displayName));
    window.api.sendSelectedDisplay(displayName);
  };

  const onImageSelect = (image: Image) => {
    window.api.sendSelectedImage(image);
    setSelectedImage(image);

    if (!image) {
      return;
    }

    if (!isPlayerShown) {
      setIsPlayerShown(true);
      window.api.sendShowPlayer(true);
    }
  };

  const onImageRemove = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img.dataUrl !== image.dataUrl),
    );
    if (selectedImage?.dataUrl === image.dataUrl) {
      setSelectedImage(null);
      window.api.sendSelectedImage(null);
    }
  };

  const contextValue: AppContextType = {
    // State
    images,
    displays,
    isPlayerShown,
    selectedImage,
    display,
    layout,
    zoom,
    rotation,
    offset,
    isPinned,

    // Actions
    onSelectedDisplayChange,
    setLayout,
    setZoom,
    setRotation,
    setOffset,

    onPinnedChanged,
    onPlayerVisibilityChange,
    onImageSelect,
    onImageRemove,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
