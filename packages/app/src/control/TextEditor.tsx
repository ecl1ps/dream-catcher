import { useAppContext } from "./AppContext";
import "./TextEditor.css";

const PLACEHOLDER_TEXT = `# Markdown text editor
You can write **bold** text, _italic_ text, and more.

## Use
### Headings

* Bullet
* Lists
1. Numbered
2. Lists

|Various|Table|Features|
|-------|-----|--------|
| Cell  | Cell| Cell   |
| Cell  | Cell| Cell   |

[Links](https://www.example.com)
![Images](https://placehold.co/30)

* [ ] Task lists
* [x] Supported

and other markdown features.

Enjoy writing your notes!
`;

export const TextEditor = () => {
  const { textContent, setTextContent } = useAppContext();

  return (
    <div className="text-editor_wrapper">
      <textarea
        className="text-editor_editor"
        placeholder={PLACEHOLDER_TEXT}
        onChange={(event) => setTextContent(event.target.value)}
        value={textContent}
      ></textarea>
    </div>
  );
};
