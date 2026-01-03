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
import {
  loadConfigurationData,
  saveConfigurationData,
} from "./storage/configuration";

interface AppState {
  images: Image[];
  displays: Display[] | null;
  selectedImage: Image | null;
  display: { name: string; width: number; height: number };
  layout: string;
  zoom: number;
  rotation: number;
  offset: { x: number; y: number };
  isPlayerShown: boolean;
  isBackgroundShown: boolean;
  isPinned: boolean;
}

interface AppActions {
  selectDisplay: (displayName: string) => void;
  removeImage: (image: Image) => void;

  setSelectedImage: (image: Image) => void;
  setIsPinned: (pinned: boolean) => void;
  setIsPlayerShown: (isShown: boolean) => void;
  setLayout: React.Dispatch<React.SetStateAction<string>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsBackgroundShown: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isBackgroundShown, setIsBackgroundShown] = useState(true);

  const isImageSideways = rotation % 180 !== 0;

  const selectDisplay = (displayName: string) => {
    setDisplay(displays.find((d) => d.name === displayName));
  };

  const removeImage = (image: Image) => {
    setImages((prevImages) =>
      prevImages.filter((img) => img.dataUrl !== image.dataUrl),
    );
    if (selectedImage?.dataUrl === image.dataUrl) {
      setSelectedImage(null);
    }
  };

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

    // Load stored values or use defaults
    const configData = loadConfigurationData();
    if (configData) {
      setLayout(configData.layout);
      setZoom(configData.zoom);
      setRotation(configData.rotation);
      setOffset(configData.offset);
      setIsPinned(configData.isPinned);
      setIsBackgroundShown(configData.isBackgroundShown);
    }
  }, []);

  useEffect(() => {
    if (displays) {
      setDisplay(displays.find((d) => d.isPreselected));
    }
  }, [displays]);

  useEffect(() => {
    window.api.sendShowBackground(isBackgroundShown);
  }, [isBackgroundShown]);

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

  useEffect(() => {
    window.api.sendPinnedWindow(isPinned);
  }, [isPinned]);

  useEffect(() => {
    window.api.sendShowPlayer(isPlayerShown);
  }, [isPlayerShown]);

  useEffect(() => {
    window.api.sendSelectedDisplay(display.name);
  }, [display]);

  useEffect(() => {
    window.api.sendSelectedImage(selectedImage);

    if (!selectedImage) {
      return;
    }

    if (!isPlayerShown) {
      setIsPlayerShown(true);
    }
  }, [selectedImage]);

  // Save context data to localStorage whenever relevant state changes
  useEffect(() => {
    const contextData = {
      layout,
      zoom,
      rotation,
      offset,
      isBackgroundShown,
      isPinned,
    };
    saveConfigurationData(contextData);
  }, [layout, zoom, rotation, offset, isBackgroundShown, isPinned]);

  const contextValue: AppContextType = {
    // State
    images,
    displays,
    selectedImage,
    display,
    layout,
    zoom,
    rotation,
    offset,
    isPlayerShown,
    isBackgroundShown,
    isPinned,

    // Actions
    setLayout,
    setZoom,
    setRotation,
    setOffset,
    setIsBackgroundShown,
    setIsPinned,
    setIsPlayerShown,
    setSelectedImage,

    selectDisplay,
    removeImage,
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
