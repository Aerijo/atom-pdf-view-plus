import {CompositeDisposable} from "atom";
import * as path from "path";
import * as fs from "fs";
import PdfEditorView from "./pdf-editor-view";

class PdfViewPackage {
  subscriptions: CompositeDisposable;
  pdfExtensions: Set<string>;

  constructor() {
    this.subscriptions = new CompositeDisposable();
    this.pdfExtensions = new Set();
  }

  activate() {
    console.log("Activated pdf-view-plus");
    this.subscriptions.add(
      atom.workspace.addOpener(this.openUri.bind(this)),
      atom.config.observe("pdf-view-plus.fileExtensions", this.updateFileExtensions.bind(this))
    );
  }

  deserialize({filePath}: any) {
    if (fs.statSync(filePath).isFile()) {
      return new PdfEditorView(filePath);
    } else {
      console.warn(
        `Could not deserialize PDF editor for path '${filePath}' because that file no longer exists`
      );
    }
  }

  dispose() {
    this.subscriptions.dispose();
  }

  deactivate() {
    this.dispose();
  }

  openUri(uriToOpen: string): any {
    const uriExtension = path.extname(uriToOpen).toLowerCase();
    if (this.pdfExtensions.has(uriExtension)) {
      return new PdfEditorView(uriToOpen);
    }
  }

  updateFileExtensions(extensions: string[]) {
    this.pdfExtensions.clear();
    for (let extension of extensions) {
      extension = extension.toLowerCase().replace(/^\.*/, ".");
      this.pdfExtensions.add(extension);
    }
  }
}

const pack = new PdfViewPackage();

module.exports = pack;
