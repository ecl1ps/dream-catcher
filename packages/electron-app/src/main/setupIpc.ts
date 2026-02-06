import { clipboard, ipcMain, MessageChannelMain, screen, type BrowserWindow } from "electron";
import ClipboardListener from "../clipboard-event/index";
import type { Image } from "../types/Image";
import { preselectDisplay } from "./preselectDisplay";

export function setupIpc(controlWindow: BrowserWindow, playerWindow: BrowserWindow) {
  ipcMain.on("selected-display", (_, displayLabel: string) => {
    const display = screen.getAllDisplays().find((d) => d.label === displayLabel);

    if (display) {
      playerWindow.setBounds(display.bounds);
      playerWindow.setAlwaysOnTop(true);
    }
  });

  ipcMain.on("pinned-window", (_, isPinned: boolean) => {
    controlWindow.setAlwaysOnTop(isPinned);
  });
  ipcMain.on("show-player", (_, isShown: boolean) => {
    if (isShown) {
      playerWindow.show();
    } else {
      playerWindow.hide();
    }
  });

  console.log("Starting clipboard listener");
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

  let playerPortSent = false;
  let controlPortSent = false;

  // Wait for player renderer to signal it's ready
  ipcMain.once("player-ready", () => {
    if (!playerPortSent) {
      console.log("Player renderer is ready, sending port");
      sendPlayerWindowInitData();
      playerPortSent = true;
    }
  });

  // Wait for control renderer to signal it's ready
  ipcMain.once("control-ready", () => {
    if (!controlPortSent) {
      console.log("Control renderer is ready, sending port and display list");
      sendControlWindowInitData();
      controlPortSent = true;
    }
  });

  // Fallback timeouts in case the ready signals never come
  playerWindow.once("ready-to-show", () => {
    setTimeout(() => {
      if (!playerPortSent) {
        console.log("Player ready signal timeout, sending port anyway");
        sendPlayerWindowInitData();
        playerPortSent = true;
      }
    }, 3000);
  });

  controlWindow.once("ready-to-show", () => {
    setTimeout(() => {
      if (!controlPortSent) {
        console.log("Control ready signal timeout, sending port and display list anyway");
        sendControlWindowInitData();
        controlPortSent = true;
      }
    }, 3000);
  });

  function sendPlayerWindowInitData() {
    playerWindow.webContents.postMessage("port", null, [port2]);
  }

  function sendControlWindowInitData() {
    controlWindow.webContents.postMessage("port", null, [port1]);

    const preselectedDisplay = preselectDisplay(screen.getAllDisplays());
    console.log("Preselected display sent");
    controlWindow.webContents.send(
      "display-list",
      screen.getAllDisplays().map((d) => ({
        name: d.label,
        width: d.workAreaSize.width,
        height: d.workAreaSize.height,
        isPreselected: preselectedDisplay.id === d.id,
      }))
    );
  }
}

