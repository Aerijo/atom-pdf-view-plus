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

function refreshContents(filepath) {
  PDFViewerApplication.open(filepath);
}
