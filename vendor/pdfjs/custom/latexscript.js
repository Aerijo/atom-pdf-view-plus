// Hides "basic debug information" and other cruft logged by PDFjs
// console.log = () => {}

window.onload = () => {
  PDFViewerApplicationOptions.set("sidebarViewOnLoad", 0);
  PDFViewerApplicationOptions.set("enableWebGL", true);
  PDFViewerApplicationOptions.set("externalLinkTarget", 4);
  PDFViewerApplicationOptions.set("eventBusDispatchToDOM", true);
  PDFViewerApplicationOptions.set("renderInteractiveForms", false); // TODO: Can these be saved?
  PDFViewerApplicationOptions.set("isEvalSupported", false);
}

window.addEventListener("message", event => {
  const data = event.data;
  switch (data.type) {
    case "refresh":
      refreshContents(data.filepath);
      return;
    case "synctex":
      handleSynctex(data);
      return;
    default:
      throw new Error(`Unexpected message type ${data.type} received`);
  }
});

async function refreshContents(filepath) {
  if (typeof filepath !== "string") {
    throw new Error(`Expected string as filepath, got ${filepath}`);
  }
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

function handleSynctex({page, x: pdfX, y: pdfY}) {
  if (typeof page !== "number") {
    throw new Error("Expected page number");
  }

  const clientHeight = PDFViewerApplication.appConfig.mainContainer.clientHeight;
  const clientWidth = PDFViewerApplication.appConfig.mainContainer.clientWidth;

  const pageView = PDFViewerApplication.pdfViewer.getPageView(page);
  const [x, y] = pageView.viewport.convertToViewportPoint(pdfX, pdfY);
  const height = pageView.div.offsetTop;

  const percentDown = 0.50;
  const percentAcross = 0.50;

  PDFViewerApplication.pdfViewer.container.scrollTo({
    top: height + y - clientHeight * percentDown,
    left: x - clientWidth * percentAcross,
  });
}

document.addEventListener("pagerendered", evt => {
  const page = evt.detail.pageNumber - 1;
  const pageView = PDFViewerApplication.pdfViewer.getPageView(page);
  pageView.div.onclick = e => {
    console.log(e);
    const rect = pageView.div.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const [x, y] = pageView.viewport.convertToPdfPoint(relX, relY);
    parent.postMessage({type: "click", position: {x, y}, page: page});
  };
}, {capture: true, passive: true});

document.addEventListener("click", evt => {
  const srcElement = evt.srcElement;
  if (srcElement.href !== undefined && srcElement.target === "_top") {
    evt.preventDefault();
    parent.postMessage({type: "link", href: srcElement.href});
  }
});
