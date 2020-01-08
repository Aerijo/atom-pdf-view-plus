import { PdfEvents } from "./main";
import * as cp from "child_process";
import * as path from "path";

export class SynctexConsumer {
  consumePdfview(pdfView: PdfEvents) {
    pdfView.onDidOpenPdf(editor => {
      editor.onDidDoubleClick(evt => {
        const {pageIndex, x, y, height} = evt.position;
        const cmd = `synctex edit -o "${pageIndex + 1}:${Math.floor(x)}:${Math.floor(height - y)}:${editor.getPath()}"`;
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
      });
    });
  }
}

function parseSynctex(stdout: string) {
  const location = {source: "", row: 0, column: 0};
  const lines = stdout.split(/\r?\n/g);
  for (const line of lines) {
    const match = line.match(/^(\w+):(.+)$/);
    if (!match) { continue; }
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
