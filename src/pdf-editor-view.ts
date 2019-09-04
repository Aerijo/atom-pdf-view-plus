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

    this.ready = false;
    frame.onload = () => {
      this.ready = true;
    };

    this.element = frame;
    this.setFile(this.filepath);
  }

  get filepath() {
    return this.editor.getPath();
  }

  viewerSrc(): string {
    return path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html");
  }

  setFile(filepath: string) {
    const src = `${this.viewerSrc()}?file=${encodeURIComponent(filepath)}`;
    this.element.setAttribute("src", src);
  }

  update() {
    if (this.ready) {
      this.element.contentWindow.postMessage({
        type: "refresh",
        source: this.filepath,
      });
    } else {
      this.setFile(this.filepath);
    }
  }

  destroy() {
    this.element = undefined;
    this.editor = undefined!;
    console.log("destroyed view");
  }
}
