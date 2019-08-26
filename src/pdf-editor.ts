import * as fs from "fs";
import * as path from "path";
import {File, CompositeDisposable} from "atom";
import PdfEditorView from './pdf-editor-view';

export default class PdfEditor {
  static deserialize({filePath}: any) {
    if (fs.statSync(filePath).isFile()) {
      return new PdfEditor(filePath);
    } else {
      console.warn(`Could not deserialise PDF view for path ${filePath} because that file no longer exists`);
    }
  }

  file: File;
  subscriptions: CompositeDisposable;
  pdfView?: PdfEditorView;

  constructor(filePath: string) {
    this.file = new File(filePath);
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(this.file.onDidDelete(() => {
      if (atom.config.get("pdf-view-plus.closeViewWhenFileDeleted")) {
        try {
          const pane = atom.workspace.paneForURI(filePath)!;
          pane.destroyItem(pane.itemForURI(filePath)!);
        } catch (e) {
          console.warn(`Could not destroy pane after external file was deleted: ${e}`);
        }
        this.subscriptions.dispose()
      }
    }));

    let timerID: any;
    const debounced = (callback: Function) => {
      clearTimeout(timerID);
      timerID = setTimeout(callback, 200);
    }

    this.subscriptions.add(this.file.onDidChange(() => {
      debounced(() => {
        this.view.update();
      });
    }));
  }

  get element() {
    return this.view.element;
  }

  get view() {
    if (!this.pdfView) {
      this.pdfView = new PdfEditorView(this);
    }
    return this.pdfView;
  }

  serialize() {
    return {
      filePath: this.getPath(),
      deserializer: this.constructor.name,
    };
  }

  destroy() {
    this.subscriptions.dispose();
    if (this.view) {
      this.view.destroy();
    }
  }

  getPath() {
    return this.file.getPath();
  }

  // Used by atom.workspace.open to detect already open URIs
  getURI() {
    return this.getPath()
  }

  getTitle() {
    const filePath = this.getPath()
    if (filePath) {
      return path.basename(filePath)
    } else {
      return 'untitled'
    }
  }

  isEqual(other: any) {
    return other instanceof PdfEditor && (this.getURI() === other.getURI());
  }
}
