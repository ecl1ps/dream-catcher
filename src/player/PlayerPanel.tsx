import { useEffect, useState } from "react";
import { Layout } from "../models/Layout";
import { Image } from "../models/Image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./PlayerPanel.css";

export const PlayerPanel = () => {
  const [image, setImage] = useState<Image>(null);
  const [layout, setLayout] = useState<Layout>({
    type: "center",
    zoom: 100,
    rotation: 0,
  });
  const [textContent, setTextContent] = useState<string>(null);
  const [selectedView, setSelectedView] = useState<string>("image");

  useEffect(() => {
    window.api.onNewImage((image) => {
      console.log("Received new image data:", image);
      setImage(image);
    });
    window.api.onTextContent((text) => {
      console.log("Received text content:", text);
      setTextContent(text);
    });
    window.api.onLayoutUpdate((layout) => {
      console.log("Received layout update:", layout);
      setLayout(layout);
    });
    window.api.onBackgroundToggle((isShown) => {
      console.log("Received background toggle:", isShown);
      document.body.classList.toggle("transparent", !isShown);
    });
    window.api.onSelectedView((view) => {
      console.log("Received selected view:", view);
      setSelectedView(view);
    });
  }, []);

  if (!image && !textContent) {
    return null;
  }

  const transforms = {
    transformOrigin: "center center",
    transform: `translate(-50%, -50%) rotate(${layout.rotation}deg) scale(${layout.zoom / 100})`,
    translate: computeTranslation(layout),
    transition: "transform 0.3s ease, translate 0.3s ease",
  };

  if (selectedView === "text" && textContent) {
    const width = `calc(${layout.type === "left-third" || layout.type == "right-third" ? "56" : "90"}${layout.rotation % 180 === 0 ? "vw" : "vh"} / ${layout.zoom / 100})`;
    return (
      <div
        className="player-panel_text-wrapper"
        style={{ ...transforms, maxWidth: width }}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{textContent}</Markdown>
      </div>
    );
  } else if (selectedView === "image" && image) {
    return <img src={image.dataUrl} style={transforms} />;
  }

  return null;
};

function computeTranslation(layout: Layout) {
  switch (layout.type) {
    case "left-third":
      return `33vw 50vh`;
    case "right-third":
      return `67vw 50vh`;
    case "custom":
      return `${layout.offset.x}vw ${layout.offset.y}vh`;
    case "center":
    case "fullscreen":
    default:
      return `50vw 50vh`;
  }
}
