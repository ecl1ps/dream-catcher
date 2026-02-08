export type Layout =
  | {
      type: "fullscreen" | "left-third" | "right-third" | "center";
      zoom: number;
      rotation: number;
    }
  | {
      type: "custom";
      zoom: number;
      rotation: number;
      offset: { x: number | string; y: number | string };
    };
