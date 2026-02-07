import { EyeFill } from "../icons/EyeFill";
import { EyeOff } from "../icons/EyeOff";
import { PinFill } from "../icons/PinFill";
import { PinOutline } from "../icons/PinOutline";
import { IconButton } from "./IconButton";
import { useAppContext } from "./AppContext";
import { RoundStickerFill } from "../icons/RoundStickerFill";
import { RoundSticker } from "../icons/RoundSticker";

import "./LayoutControls.css";

interface LayoutControlProps {}

export const LayoutControls = ({}: LayoutControlProps) => {
  const {
    displays,
    display,
    layout,
    zoom,
    rotation,
    offset,
    isPlayerShown,
    isBackgroundShown,
    isPinned,
    setLayout,
    setZoom,
    setRotation,
    setOffset,
    setIsBackgroundShown,
    setIsPinned,
    setIsPlayerShown,
    selectDisplay,
  } = useAppContext();

  return (
    <div className="layout-controls_wrapper">
      <span className="layout-controls_title">Display</span>
      <div className="layout-controls_controls">
        {displays && (
          <select value={display.name} onChange={(e) => selectDisplay(e.target.value)}>
            {displays.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.width}x{d.height})
              </option>
            ))}
          </select>
        )}
        <IconButton
          title={isPinned ? "Unpin window" : "Pin window"}
          isActive={isPinned}
          onClick={() => setIsPinned(!isPinned)}
        >
          {isPinned ? <PinFill /> : <PinOutline />}
        </IconButton>
        <IconButton
          title={isPlayerShown ? "Hide player" : "Show player"}
          isActive={isPlayerShown}
          onClick={() => setIsPlayerShown(!isPlayerShown)}
        >
          {isPlayerShown ? <EyeFill /> : <EyeOff />}
        </IconButton>
        <IconButton
          title={isBackgroundShown ? "Hide background" : "Show background"}
          isActive={isBackgroundShown}
          onClick={() => setIsBackgroundShown(!isBackgroundShown)}
        >
          {isBackgroundShown ? <RoundStickerFill /> : <RoundSticker />}
        </IconButton>
      </div>
      <span className="layout-controls_title">Layout</span>
      <div className="layout-controls_controls">
        <button
          className={layout == "left-third" ? "is-selected" : ""}
          onClick={() => {
            setLayout("left-third");
            setOffset({ x: 33, y: 50 });
          }}
        >
          Left-third
        </button>
        <button
          className={layout == "center" ? "is-selected" : ""}
          onClick={() => {
            setLayout("center");
            setOffset({ x: 50, y: 50 });
          }}
        >
          Center
        </button>
        <button
          className={layout == "right-third" ? "is-selected" : ""}
          onClick={() => {
            setLayout("right-third");
            setOffset({ x: 67, y: 50 });
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
          className={layout == "custom" ? "is-selected" : ""}
          onClick={() => {
            setLayout("custom");
          }}
        >
          Custom
        </button>
      </div>
      <span className="layout-controls_title">Zoom</span>
      <div className="layout-controls_controls">
        <input
          type="range"
          min={10}
          max={300}
          step={5}
          value={zoom}
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
        />{" "}
        {zoom}%
      </div>
      <span className="layout-controls_title">Rotation</span>
      <div className="layout-controls_controls">
        <button
          className={rotation == 0 ? "is-selected" : ""}
          onClick={() => {
            setRotation(0);
          }}
        >
          Down
        </button>
        <button
          className={rotation == 90 ? "is-selected" : ""}
          onClick={() => {
            setRotation(90);
          }}
        >
          Left
        </button>
        <button
          className={rotation == 180 ? "is-selected" : ""}
          onClick={() => {
            setRotation(180);
          }}
        >
          Up
        </button>
        <button
          className={rotation == 270 ? "is-selected" : ""}
          onClick={() => {
            setRotation(270);
          }}
        >
          Right
        </button>
      </div>
      {layout === "custom" ? (
        <>
          <span className="layout-controls_title">Position </span>
          <div className="layout-controls_controls">
            <span className="layout-controls_range-input">
              X:{" "}
              <input
                type="range"
                min={0}
                max={100}
                step={5}
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
                step={5}
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
        </>
      ) : null}
    </div>
  );
};
