import * as fs from "fs";
import * as path from "path";
import {File, Disposable, CompositeDisposable} from "atom";
import {PdfEditorView, PdfClick, PdfPosition} from "./pdf-editor-view";

export class PdfEditor {
  static deserialize({filePath}: any) {
    let isFile = false;
    try {
      isFile = fs.statSync(filePath).isFile();
    } catch (e) {}

    if (isFile) {
      return new PdfEditor(filePath);
    } else {
      console.warn(
        `Could not deserialise PDF view for path ${filePath} because that file no longer exists`
      );
    }
  }

  file: File;
  view: PdfEditorView;
  subscriptions: CompositeDisposable;
  onDidChangeTitleCallbacks: Set<Function>;

  constructor(filePath: string) {
    this.file = new File(filePath);
    this.subscriptions = new CompositeDisposable();
    this.view = new PdfEditorView(this);
    this.onDidChangeTitleCallbacks = new Set();

    let timerID: number;
    const debounced = (callback: Function) => {
      clearTimeout(timerID);
      timerID = setTimeout(callback, 200);
    };

    this.subscriptions.add(
      this.file.onDidRename(() => {
        // Doesn't seem to work (on Linux at least)
        this.updateTitle();
      }),
      this.file.onDidChange(() => {
        debounced(() => {
          this.view.update();
        });
      }),
      this.file.onDidDelete(() => {
        if (atom.config.get("pdf-view-plus.closeViewWhenFileDeleted")) {
          try {
            this.destroy();
          } catch (e) {
            console.warn(`Could not destroy pane after external file was deleted: ${e}`);
          }
        }
      })
    );
  }

  get element() {
    return this.view.element;
  }

  serialize() {
    return {
      filePath: this.getPath(),
      deserializer: this.constructor.name,
    };
  }

  destroy() {
    this.subscriptions.dispose();
    this.view.destroy();
    const pane = atom.workspace.paneForItem(this);
    if (pane) {
      pane.destroyItem(this);
    }
  }

  onDidDispose(cb: () => void) {
    this.subscriptions.add(new Disposable(cb));
  }

  getPath() {
    return this.file.getPath();
  }

  // Used by atom.workspace.open to detect already open URIs
  getURI() {
    return this.getPath();
  }

  getTitle() {
    const filePath = this.getPath();
    return filePath ? path.basename(filePath) : "untitled";
  }

  updateTitle() {
    this.onDidChangeTitleCallbacks.forEach(cb => cb());
  }

  onDidChangeTitle(cb: Function) {
    this.onDidChangeTitleCallbacks.add(cb);
    return new Disposable(() => {
      this.onDidChangeTitleCallbacks.delete(cb);
    });
  }

  isEqual(other: any) {
    return other instanceof PdfEditor && this.getURI() === other.getURI();
  }

  onDidClick(cb: (pos: PdfClick) => void) {
    this.view.onDidClick(cb);
  }

  onDidDoubleClick(cb: (pos: PdfClick) => void) {
    this.view.onDidDoubleClick(cb);
  }

  scrollToPosition(pos: PdfPosition) {
    this.view.scrollToPosition(pos);
  }
}
