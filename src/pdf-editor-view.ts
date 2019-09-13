import * as path from "path";
import PdfEditor from "./pdf-editor";

interface Message {
  origin: string,
  data: any,
  source: any,
}

export default class PdfEditorView {
  element: any;
  editor: PdfEditor;
  ready: boolean;

  constructor(editor: PdfEditor) {
    this.editor = editor;
    const frame = document.createElement("iframe");
    this.element = frame;

    frame.setAttribute("id", "pdf-frame");

    this.ready = false;
    frame.onload = () => {
      this.ready = true;
    };

    window.addEventListener("message", evt => {this.handleMessage(evt as any)});

    this.setFile(this.filepath);
  }

  handleMessage(msg: Message) {
    if (this.element.contentWindow !== msg.source) { return; }
    const type: string = msg.data.type;
    switch (type) {
      case "link":
        this.handleLink(msg.data.href);
        return;
      case "click":
        this.handleClick(msg.data);
        return;
      default:
        throw new Error(`Unexpected message type ${type} from iframe`);
    }
  }

  async handleLink(link: string) {
    (await import("electron")).shell.openExternal(link);
  }

  handleClick(data: any) {
    console.log(data);
  }

  get filepath() {
    return this.editor.getPath();
  }

  viewerSrc(): string {
    return path.join(__dirname, "..", "vendor", "pdfjs", "web", "viewer.html");
  }

  setFile(filepath: string) {
    const src = `${this.viewerSrc()}?file=${encodeURIComponent(filepath)}`;
    this.ready = false;
    this.element.setAttribute("src", src);
  }

  update() {
    if (this.ready) {
      this.element.contentWindow.postMessage({
        type: "refresh",
        source: this.filepath,
      });
    } else {
      this.setFile(this.filepath);
    }
  }

  destroy() {}
}
