import * as path from "path";

export default class PdfEditorView {
  element: any;
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;

    this.element = document.createElement("iframe");
    this.element.setAttribute("id", "pdf-frame");
    this.element.setAttribute("width", "100%");
    this.element.setAttribute("height", "100%");
    this.element.setAttribute("style", "border:none;");

    const src = `${path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html")}?file=${filePath}`;
    this.element.setAttribute("src", src);
  }

  getTitle() {
    return path.basename(this.filePath);
  }
}
