// import * as fs from "fs";
import * as path from "path";

export default class PdfEditorView {
  element: any;
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.element = document.createElement("div");
    const src = path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html");
    this.element.innerHTML = `<iframe height="100%" width="100%" src="${src}?file=${filePath}"></iframe>`;
  }

  getTitle() {
    return path.basename(this.filePath);
  }

  scrollToPage(page: number) {
    console.log(`scrolling to ${page}`)
  }
}
