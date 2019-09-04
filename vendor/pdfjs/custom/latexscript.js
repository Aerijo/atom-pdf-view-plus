console.log(this)

PDFViewerApplicationOptions.set("sidebarViewOnLoad", 0);
PDFViewerApplicationOptions.set("enableWebGL", true);
PDFViewerApplicationOptions.set("externalLinkTarget", 4);
PDFViewerApplicationOptions.set("eventBusDispatchToDOM", true);

window.addEventListener("message", event => {
  const data = event.data;
  if (data.source) {
    PDFViewerApplication.open(message.data.source);
  }
});
