import * as path from "path";
import PdfEditor from "./pdf-editor";

export default class PdfEditorView {
  element: any;
  editor: PdfEditor;
  ready: boolean;

  constructor(editor: PdfEditor) {
    this.editor = editor;
    const frame = document.createElement("iframe");
    frame.setAttribute("id", "pdf-frame");
    frame.setAttribute("width", "100%");
    frame.setAttribute("height", "100%");

    this.ready = false;
    frame.onload = () => {
      this.ready = true;
    };

    this.element = frame;
    this.rename();
  }

  get filePath() {
    return this.editor.getPath();
  }

  viewerSrc(): string {
    return path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html");
  }

  rename() {
    const src = `${this.viewerSrc()}?file=${encodeURIComponent(this.filePath)}`;
    this.element.setAttribute("src", src);
  }

  update() {
    if (this.ready) {
      this.element.contentWindow.postMessage({
        source: this.filePath,
      });
      // this.element.reloadIgnoringCache();
    } else {
      this.rename();
    }
  }

  destroy() {}
}
