import {CompositeDisposable} from "atom";
import * as path from "path";
import PdfEditor from './pdf-editor';

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
      atom.workspace.addOpener(uri => {
        const uriExtension = path.extname(uri).toLowerCase();
        if (this.pdfExtensions.has(uriExtension)) {
          return new PdfEditor(uri);
        }
      }),
      atom.config.observe("pdf-view-plus.fileExtensions", this.updateFileExtensions.bind(this))
    );
  }

  deserialize(params: any) {
    return PdfEditor.deserialize(params);
  }

  dispose() {
    this.subscriptions.dispose();
  }

  deactivate() {
    this.dispose();
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
