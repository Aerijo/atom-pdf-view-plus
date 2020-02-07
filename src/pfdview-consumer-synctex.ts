import * as cp from "child_process";
import * as path from "path";
import { PdfEvents, PdfView } from './pdfview-api';
import {CompositeDisposable} from "atom";

export class SynctexConsumer {
  editorSubscriptions: WeakMap<PdfView, CompositeDisposable>;
  subscriptions: CompositeDisposable;
  destroyed: boolean;

  constructor() {
    this.editorSubscriptions = new WeakMap(); // TODO: Allow for unsubscription instead of tracking destroyed
    this.subscriptions = new CompositeDisposable();
    this.destroyed = false;
  }

  destroy() {
    this.subscriptions.dispose();
    this.destroyed = true;
  }

  consumePdfview(pdfView: PdfEvents) {
    this.subscriptions.add(pdfView.observePdfViews(editor => {
      const subs = new CompositeDisposable();

      subs.add(editor.onDidDoubleClick(evt => {
        if (this.destroyed) {
          return;
        }

        const {pageIndex, pointX, pointY, height} = evt.position;
        const cmd = `synctex edit -o "${pageIndex + 1}:${Math.floor(pointX)}:${Math.floor(
          height - pointY
        )}:${editor.getPath()}"`;
        cp.exec(cmd, (err, stdout) => {
          if (err) {
            return;
          }
          const location = parseSynctex(stdout);

          if (location.source === undefined || location.row === undefined) {
            console.error("Could not read synctex output properly");
            return;
          }

          atom.workspace.open(location.source, {
            initialLine: location.row,
            initialColumn: location.column >= 0 ? location.column : 0,
            searchAllPanes: true,
          });
        });
      }));

      this.editorSubscriptions.set(editor, subs);
    }));
  }
}

function parseSynctex(stdout: string) {
  const location = {source: "", row: 0, column: 0};
  const lines = stdout.split(/\r?\n/g);
  for (const line of lines) {
    const match = line.match(/^(\w+):(.+)$/);
    if (!match) {
      continue;
    }
    const key = match[1];
    const val = match[2];
    switch (key) {
      case "Input":
        location.source = path.normalize(val);
        break;
      case "Line":
        location.row = parseInt(val, 10) - 1;
        break;
      case "Column":
        location.column = parseInt(val, 10);
        break;
    }
  }
  return location;
}
