// import * as fs from "fs";
import * as path from "path";

export default class PdfEditorView {
  element: any;
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.element = document.createElement("div");
    this.element.innerHTML = `<iframe height="100%" width="100%" src="/home/benjamin/github/atom-pdf-view-plus/vendor/pdfjs/web/viewer.html?file=${filePath}"></iframe>`;
  }

  getTitle() {
    return path.basename(this.filePath);
  }

  scrollToPage(page: number) {
    console.log(`scrolling to ${page}`)
  }
}
