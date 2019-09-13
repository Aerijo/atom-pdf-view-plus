// Hides "basic debug information" and other cruft logged by PDFjs
// console.log = () => {}

window.onload = () => {
  PDFViewerApplicationOptions.set("sidebarViewOnLoad", 0);
  PDFViewerApplicationOptions.set("enableWebGL", true);
  PDFViewerApplicationOptions.set("externalLinkTarget", 4);
  PDFViewerApplicationOptions.set("eventBusDispatchToDOM", true);
  PDFViewerApplicationOptions.set("renderInteractiveForms", false); // TODO: Can these be saved?
}

window.addEventListener("message", event => {
  const data = event.data;
  switch (data.type) {
    case "refresh":
      refreshContents(data.source);
      return;
    default:
      throw new Error(`Unexpected message type ${data.type} received`);
  }
});

async function refreshContents(filepath) {
  const params = getDocumentParams();
  PDFViewerApplication.open(filepath);
  document.addEventListener(
    "pagesinit",
    () => {restoreFromParams(params)},
    {once: true, passive: true}
  );
}

function getDocumentParams() {
  const container = document.getElementById("viewerContainer");
  return {
    scale: PDFViewerApplication.pdfViewer.currentScaleValue,
    scrollTop: container.scrollTop,
    scrollLeft: container.scrollLeft,
  }
}

function restoreFromParams({scale, scrollTop, scrollLeft}) {
  const container = document.getElementById("viewerContainer");
  PDFViewerApplication.pdfViewer.currentScaleValue = scale;
  container.scrollTop = scrollTop;
  container.scrollLeft = scrollLeft;
}

document.addEventListener("pagerendered", (evt) => {
  const page = evt.detail.pageNumber - 1;
  const canvasDom = PDFViewerApplication.pdfViewer.getPageView(page).div;
  canvasDom.onclick = (e) => {
    const viewerContainer = PDFViewerApplication.pdfViewer.spreadMode === 0
      ? canvasDom.parentNode.parentNode
      : viewerContainer = canvasDom.parentNode.parentNode.parentNode;
    const left = e.pageX - canvasDom.offsetLeft + viewerContainer.scrollLeft;
    const top = e.pageY - canvasDom.offsetTop + viewerContainer.scrollTop - 41;
    const pos = PDFViewerApplication.pdfViewer._pages[page].getPagePoint(left, canvasDom.offsetHeight - top);
    parent.postMessage({type: "click", position: pos, page: page});
  };
}, {capture: true, passive: true});

// Open links externally identified by target set from PDFJS.LinkTarget.TOP
document.addEventListener("click", (evt) => {
  const srcElement = evt.srcElement;
  if (srcElement.href !== undefined && srcElement.target === "_top") {
    evt.preventDefault();
    parent.postMessage({type: "link", href: srcElement.href});
  }
});
