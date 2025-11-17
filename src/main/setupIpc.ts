import {
  clipboard,
  ipcMain,
  MessageChannelMain,
  screen,
  type BrowserWindow,
} from "electron";
import ClipboardListener from "../clipboard-event/index";
import { Image } from "../models/Image";
import { preselectDisplay } from "./preselectDisplay";

export function setupIpc(
  controlWindow: BrowserWindow,
  playerWindow: BrowserWindow,
) {
  ipcMain.on("selected-display", (_, displayLabel: string) => {
    const display = screen
      .getAllDisplays()
      .find((d) => d.label === displayLabel);

    if (display) {
      playerWindow.setBounds(display.bounds);
    }
  });

  ClipboardListener.startListening();

  ClipboardListener.on("change", async () => {
    const image = clipboard.readImage();
    const html = clipboard.readHTML(); // e.g '<img src="https://css-tricks.com/wp-content/uploads/2018/11/align-self-end.svg" alt="Example of align-self set to end"/>'

    console.log("Clipboard changed");

    if (image && !image.isEmpty()) {
      const dto: Image = {
        dataUrl: image.toDataURL(),
        width: image.getSize().width,
        height: image.getSize().height,
      };

      controlWindow.webContents.send("new-image", dto);

      if (!controlWindow.isFocused() && !controlWindow.isMinimized()) {
        controlWindow.minimize();
      }

      controlWindow.show();

      controlWindow.setAlwaysOnTop(true);
      controlWindow.focus();
      controlWindow.setAlwaysOnTop(false);
    }
  });

  const { port1, port2 } = new MessageChannelMain();

  controlWindow.once("ready-to-show", () => {
    controlWindow.webContents.postMessage("port", null, [port1]);
  });

  playerWindow.once("ready-to-show", () => {
    playerWindow.webContents.postMessage("port", null, [port2]);
  });

  controlWindow.once("ready-to-show", () => {
    const preselectedDisplay = preselectDisplay(screen.getAllDisplays());
    controlWindow.webContents.send(
      "display-list",
      screen.getAllDisplays().map((d) => ({
        name: d.label,
        width: d.workAreaSize.width,
        height: d.workAreaSize.height,
        isPreselected: preselectedDisplay.id === d.id,
      })),
    );
  });
}
