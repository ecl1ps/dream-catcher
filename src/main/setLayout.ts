import { type BrowserWindow, screen } from "electron";

export const setLayout = (layout: string, playerWindow: BrowserWindow) => {
  console.log(`Setting layout to: ${layout}`);

  const display = screen.getDisplayMatching(playerWindow.getBounds());

  switch (layout) {
    case "fullscreen":
      playerWindow.setBounds(display.workArea);
      break;
    default:
      playerWindow.setBounds({
        width: 1024,
        height: 768,
        x: display.workArea.x,
        y: display.workArea.y,
      });
  }
};
