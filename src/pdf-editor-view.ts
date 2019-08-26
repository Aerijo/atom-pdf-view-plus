import * as path from "path";
import PdfEditor from './pdf-editor';

export default class PdfEditorView {
  element: any;
  frame: any;
  editor: PdfEditor;

  constructor(editor: PdfEditor) {
    this.editor = editor;
    this.element = document.createElement("div");
    this.update();
  }

  get filePath() {
    return this.editor.getPath();
  }

  update() {
    const frame = document.createElement("iframe");
    frame.setAttribute("id", "pdf-frame");
    frame.setAttribute("width", "100%");
    frame.setAttribute("height", "100%");
    frame.setAttribute("frameborder", "0");

    const src = `${path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html")}?file=${encodeURIComponent(this.filePath)}`;
    frame.setAttribute("src", src);

    if (this.frame) {
      this.element.replaceChild(frame, this.frame);
    } else {
      this.element.appendChild(frame);
    }

    this.frame = frame;
  }

  destroy() {

  }
}
