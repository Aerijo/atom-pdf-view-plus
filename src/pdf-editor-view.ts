import * as path from "path";
import PdfEditor from './pdf-editor';

export default class PdfEditorView {
  element: any;
  editor: PdfEditor;

  constructor(editor: PdfEditor) {
    this.editor = editor;
    const frame = document.createElement("iframe");
    frame.setAttribute("id", "pdf-frame");
    frame.setAttribute("width", "100%");
    frame.setAttribute("height", "100%");
    frame.setAttribute("frameborder", "0");
    this.element = frame;
    this.update();
  }

  get filePath() {
    return this.editor.getPath();
  }

  update() {
    const src = `${path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html")}?file=${encodeURIComponent(this.filePath)}`;
    this.element.setAttribute("src", src);
  }

  destroy() {

  }
}
