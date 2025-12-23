import { useEffect, useState } from "react";
import { EyeFill } from "../icons/EyeFill";
import { EyeOff } from "../icons/EyeOff";
import { PinFill } from "../icons/PinFill";
import { PinOutline } from "../icons/PinOutline";
import { Display } from "../models/Display";
import "./LayoutControls.css";

interface LayoutControlProps {
  displays: Display[] | null;
  isPlayerShown: boolean;
  onPlayerVisibilityChange: (isShown: boolean) => void;
}

export const LayoutControls = ({
  displays,
  isPlayerShown,
  onPlayerVisibilityChange,
}: LayoutControlProps) => {
  const [display, setDisplay] = useState({ name: "", width: 0, height: 0 });
  const [layout, setLayout] = useState("center");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [isPinned, setIsPinned] = useState(false);

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
      <div>
        {displays && (
          <>
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
          </>
        )}
        <button
          className="layout-controls_icon-button"
          title={isPinned ? "Unpin window" : "Pin window"}
          onClick={() => {
            window.api.sendPinnedWindow(!isPinned);
            setIsPinned(!isPinned);
          }}
        >
          {isPinned ? <PinFill size="1em" /> : <PinOutline size="1em" />}
        </button>
        <button
          className="layout-controls_icon-button"
          title={isPlayerShown ? "Hide player" : "Show player"}
          onClick={() => {
            onPlayerVisibilityChange(!isPlayerShown);
          }}
        >
          {isPlayerShown ? <EyeFill size="1em" /> : <EyeOff size="1em" />}
        </button>
      </div>
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
          }}
        >
          Right-third
        </button>
        {/*<button
          onClick={() => {
            setLayout("fullscreen");
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
      {}
    </div>
  );
};
