window.onload = () => {
  PDFViewerApplicationOptions.set("sidebarViewOnLoad", 0);
  PDFViewerApplicationOptions.set("enableWebGL", true);
  PDFViewerApplicationOptions.set("externalLinkTarget", 4);
  PDFViewerApplicationOptions.set("eventBusDispatchToDOM", true);
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
  document.addEventListener("pagesinit", () => {
    restoreFromParams(params);
  }, {once: true, passive: true});
}

function getDocumentParams() {
  const container = document.getElementById('viewerContainer');
  return {
    scale: PDFViewerApplication.pdfViewer.currentScaleValue,
    scrollTop: container.scrollTop,
    scrollLeft: container.scrollLeft,
  }
}

function restoreFromParams({scale, scrollTop, scrollLeft}) {
  const container = document.getElementById('viewerContainer');
  PDFViewerApplication.pdfViewer.currentScaleValue = scale;
  container.scrollTop = scrollTop;
  container.scrollLeft = scrollLeft;
}
