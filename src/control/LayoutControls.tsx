import { useEffect, useState } from "react";
import { Display } from "../models/Display";

interface LayoutControlProps {
  displays: Display[] | null;
}

export const LayoutControls = ({ displays }: LayoutControlProps) => {
  const [display, setDisplay] = useState({ name: "", width: 0, height: 0 });
  const [layout, setLayout] = useState("center");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (displays) {
      setDisplay(displays.find((d) => d.isPreselected));
    }
  }, [displays]);

  useEffect(() => {
    console.log("Sending layout change:", { layout, zoom, rotation, offset });

    window.api.sendSelectedLayout({ type: layout, zoom, rotation, offset });
  }, [layout, zoom, rotation, offset]);

  return (
    <>
      {displays && (
        <select
          value={display.name}
          onChange={(e) => {
            setDisplay(displays.find((d) => d.name === e.target.value));
            window.api.sendSelectedDisplay(e.target.value);
          }}
        >
          {displays.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} ({d.width}x{d.height})
            </option>
          ))}
        </select>
      )}
      <button
        onClick={() => {
          setLayout("left-third");
          setOffset({ x: 0, y: 0 });
        }}
      >
        Left-third
      </button>
      <button
        onClick={() => {
          setLayout("center");
          setOffset({ x: 0, y: 0 });
        }}
      >
        Center
      </button>
      <button
        onClick={() => {
          setLayout("right-third");
          setOffset({ x: 0, y: 0 });
        }}
      >
        Right-third
      </button>
      <button
        onClick={() => {
          setLayout("fullscreen");
          setOffset({ x: 0, y: 0 });
        }}
      >
        Fullscreen
      </button>
      <button
        onClick={() => {
          setLayout("custom");
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
        }}
      />
      <button
        onClick={() => {
          setRotation(0);
        }}
      >
        Down
      </button>
      <button
        onClick={() => {
          setRotation(90);
        }}
      >
        Left
      </button>
      <button
        onClick={() => {
          setRotation(180);
        }}
      >
        Up
      </button>
      <button
        onClick={() => {
          setRotation(270);
        }}
      >
        Right
      </button>
      <input
        type="range"
        min={0}
        max={display.width}
        step={10}
        value={offset.x}
        onChange={(e) => {
          setLayout("custom");
          setOffset((prevOffset) => ({
            ...prevOffset,
            x: Number(e.target.value),
          }));
        }}
      />
      <input
        type="range"
        min={0}
        max={display.height}
        step={10}
        value={offset.y}
        onChange={(e) => {
          setLayout("custom");
          setOffset((prevOffset) => ({
            ...prevOffset,
            y: Number(e.target.value),
          }));
        }}
      />
    </>
  );
};
