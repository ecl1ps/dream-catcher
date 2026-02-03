import { Display } from "electron";

export function preselectDisplay(displays: Display[]) {
  return (
    displays.find((screen) => screen.bounds.x !== 0 || screen.bounds.y !== 0) ||
    displays[0]
  );
}
