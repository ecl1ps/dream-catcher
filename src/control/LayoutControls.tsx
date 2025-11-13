import { useState } from "react";

interface LayoutControlProps {
  displays: string[];
}

export const LayoutControls = ({ displays }: LayoutControlProps) => {
  const [display, setDisplay] = useState(displays[0] || "");
  const [layout, setLayout] = useState("center");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const sendChange = () => {
    console.log("Sending layout change:", { layout, zoom, rotation, offset });

    window.api.sendSelectedLayout({ type: layout, zoom, rotation, offset });
  };

  return (
    <>
      <select
        value={display}
        onChange={(e) => {
          setDisplay(e.target.value);
          window.api.sendSelectedDisplay(e.target.value);
        }}
      >
        {displays.map((display) => (
          <option key={display} value={display}>
            {display}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          setLayout("left-third");
          setOffset({ x: 0, y: 0 });
          sendChange();
        }}
      >
        Left-third
      </button>
      <button
        onClick={() => {
          setLayout("center");
          setOffset({ x: 0, y: 0 });
          sendChange();
        }}
      >
        Center
      </button>
      <button
        onClick={() => {
          setLayout("right-third");
          setOffset({ x: 0, y: 0 });
          sendChange();
        }}
      >
        Right-third
      </button>
      <button
        onClick={() => {
          setLayout("fullscreen");
          setOffset({ x: 0, y: 0 });
          sendChange();
        }}
      >
        Fullscreen
      </button>
      <button
        onClick={() => {
          setLayout("custom");
          sendChange();
        }}
      >
        Custom
      </button>
      <input
        type="range"
        min={-100}
        max={200}
        step={10}
        value={zoom}
        onChange={(e) => {
          setZoom(Number(e.target.value));
          sendChange();
        }}
      />
      <button
        onClick={() => {
          setRotation(0);
          sendChange();
        }}
      >
        Down
      </button>
      <button
        onClick={() => {
          setRotation(90);
          sendChange();
        }}
      >
        Left
      </button>
      <button
        onClick={() => {
          setRotation(180);
          sendChange();
        }}
      >
        Up
      </button>
      <button
        onClick={() => {
          setRotation(270);
          sendChange();
        }}
      >
        Right
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={10}
        value={offset.x}
        onChange={(e) => {
          setLayout("custom");
          setOffset((prevOffset) => ({
            ...prevOffset,
            x: Number(e.target.value),
          }));
          sendChange();
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={10}
        value={offset.y}
        onChange={(e) => {
          setLayout("custom");
          setOffset((prevOffset) => ({
            ...prevOffset,
            y: Number(e.target.value),
          }));
          sendChange();
        }}
      />
    </>
  );
};
