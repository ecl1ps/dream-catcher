import { EventEmitter } from "node:events";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ClipboardEventListener extends EventEmitter {
  constructor() {
    super();
    this.child = null;
  }

  startListening() {
    const { platform } = process;

    const possibleBinPaths = [
      path.join(__dirname, "../../bin/clipboard/platform/"), // Development
      path.join(process.resourcesPath, "./bin/clipboard/platform/"), // Production (extraResource)
    ];

    try {
      let binaryName = null;
      switch (platform) {
        case "win32":
          binaryName = "clipboard-event-handler-win32.exe";
          break;
        case "linux":
          binaryName = "clipboard-event-handler-linux";
          break;
        case "darwin":
          binaryName = "clipboard-event-handler-mac";
          break;
      }

      if (!binaryName) {
        throw "Unsupported platform";
      }

      let binPath = "";
      for (const path of possibleBinPaths) {
        if (fs.existsSync(path)) {
          binPath = path;
          break;
        }
      }

      if (!binPath) {
        throw "Clipboard event handler binary not found";
      }

      this.child = execFile(path.join(binPath, binaryName));

      this.child.stdout.on("data", (data) => {
        if (data.trim() === "CLIPBOARD_CHANGE") {
          this.emit("change");
        }
      });
    } catch (error) {
      console.error("Failed to start clipboard event listener:", error);
    }
  }

  stopListening() {
    const res = this.child?.kill();
    return res;
  }
}

export default new ClipboardEventListener();

// Sample usage
/*
import clipboardListener from 'clipboard-event'

// To start listening
clipboardListener.startListening();

clipboardListener.on('change', () => {
  console.log('Clipboard changed');
});

// To stop listening
clipboardListener.stopListening();
*/
