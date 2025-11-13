declare module "clipboard-event" {
  interface ClipboardListener {
    startListening(): void;
    stopListening(): void;
    on(event: "change", callback: () => void): void;
  }

  const ClipboardListener: ClipboardListener;
  export default ClipboardListener;
}
