import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Display } from "../models/Display";
import { Image } from "../models/Image";
import { calculateMaxZoom } from "./utils/calculateMaxZoom";
import {
  loadConfigurationData,
  saveConfigurationData,
} from "./storage/configuration";
import { ViewType } from "../models/ViewType";

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
  view: ViewType;
  textContent: string;
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
  setView: React.Dispatch<React.SetStateAction<ViewType>>;
  setTextContent: React.Dispatch<React.SetStateAction<string>>;
}

interface AppContextType extends AppState, AppActions {}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // LayoutControls state
  const [displays, setDisplays] = useState<Display[] | null>(null);
  const [display, setDisplay] = useState({ name: "", width: 0, height: 0 });
  const [isPlayerShown, setIsPlayerShown] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isBackgroundShown, setIsBackgroundShown] = useState(true);

  const [layout, setLayout] = useState("center");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 50, y: 50 });

  // Content state
  const [view, setView] = useState<ViewType>("image");
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [textContent, setTextContent] = useState<string>("");

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
      setView(configData.view);
      setTextContent(configData.textContent);
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

  useEffect(() => {
    window.api.sendTextContent(textContent);
  }, [textContent]);

  useEffect(() => {
    window.api.sendSelectedView(view);
  }, [view]);

  // Save context data to localStorage whenever relevant state changes
  useEffect(() => {
    const contextData = {
      layout,
      zoom,
      rotation,
      offset,
      isBackgroundShown,
      isPinned,
      view,
      textContent,
    };
    saveConfigurationData(contextData);
  }, [
    layout,
    zoom,
    rotation,
    offset,
    isBackgroundShown,
    isPinned,
    view,
    textContent,
  ]);

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
    view,
    textContent,

    // Actions
    setLayout,
    setZoom,
    setRotation,
    setOffset,
    setIsBackgroundShown,
    setIsPinned,
    setIsPlayerShown,
    setSelectedImage,
    setView,
    setTextContent,

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
