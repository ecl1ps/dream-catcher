import { ImageGallery } from "./ImageGallery";
import { TextEditor } from "./TextEditor";
import { useAppContext } from "./AppContext";
import "./Content.css";

interface ContentProps {}

export const Content = ({}: ContentProps) => {
  const { view, setView } = useAppContext();

  return (
    <>
      <div className="content_header">
        <button
          className={view === "image" ? "is-selected" : ""}
          onClick={() => setView("image")}
        >
          Images
        </button>
        <button
          className={view === "text" ? "is-selected" : ""}
          onClick={() => setView("text")}
        >
          Text
        </button>
      </div>
      {view === "image" && <ImageGallery />}
      {view === "text" && <TextEditor />}
    </>
  );
};
