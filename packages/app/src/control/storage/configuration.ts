import { ViewType } from "../../types/ViewType";

type StoredConfigurationData = {
  layout: string;
  zoom: number;
  rotation: number;
  offset: { x: number; y: number };
  isBackgroundShown: boolean;
  isPinned: boolean;
  view: ViewType;
  textContent: string;
};

const CONFIG_STORAGE_KEY = "dreamcatcher-configuration";

export const saveConfigurationData = (data: StoredConfigurationData): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save context data to localStorage:", error);
  }
};

export const loadConfigurationData = (): Partial<StoredConfigurationData> | null => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredConfigurationData;
    }
  } catch (error) {
    console.error("Failed to load context data from localStorage:", error);
  }
  return null;
};
