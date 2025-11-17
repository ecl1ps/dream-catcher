import { useEffect, useState } from "react";
import { Display } from "../models/Display";
import "./LayoutControls.css";

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
    <div className="layout-controls_wrapper">
      {displays && (
        <div>
          Display
          <select
            className="layout-controls_display-select"
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
        </div>
      )}
      <div>
        Layout
        <button
          className={
            layout == "left-third"
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setLayout("left-third");
            setOffset({ x: 0, y: 0 });
          }}
        >
          Left-third
        </button>
        <button
          className={
            layout == "center"
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setLayout("center");
            setOffset({ x: 0, y: 0 });
          }}
        >
          Center
        </button>
        <button
          className={
            layout == "right-third"
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setLayout("right-third");
            setOffset({ x: 0, y: 0 });
          }}
        >
          Right-third
        </button>
        {/*<button
          onClick={() => {
            setLayout("fullscreen");
            setOffset({ x: 0, y: 0 });
          }}
        >
          Fullscreen
        </button>*/}
        <button
          className={
            layout == "custom"
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setLayout("custom");
          }}
        >
          Custom
        </button>
      </div>
      <div>
        Zoom
        <input
          type="range"
          min={10}
          max={300}
          step={10}
          value={zoom}
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
        />{" "}
        {zoom}%
      </div>
      <div>
        Rotation
        <button
          className={
            rotation == 0
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setRotation(0);
          }}
        >
          Down
        </button>
        <button
          className={
            rotation == 90
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setRotation(90);
          }}
        >
          Left
        </button>
        <button
          className={
            rotation == 180
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setRotation(180);
          }}
        >
          Up
        </button>
        <button
          className={
            rotation == 270
              ? "layout-controls_layout-button layout-controls_layout-button--is-selected"
              : "layout-controls_layout-button"
          }
          onClick={() => {
            setRotation(270);
          }}
        >
          Right
        </button>
      </div>
      {layout === "custom" ? (
        <div>
          Position{" "}
          <span className="layout-controls_range-input">
            X:{" "}
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
              }}
            />
            {offset.x}%
          </span>
          <span className="layout-controls_range-input">
            Y:{" "}
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
              }}
            />
            {offset.y}%
          </span>
        </div>
      ) : null}
    </div>
  );
};
