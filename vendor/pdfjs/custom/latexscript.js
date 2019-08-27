// console.log(this)
this.onclick = (e) => {
  // console.log("clicked", e)
  // PDFViewerApplication.pdfDocument.getPage(1).then(page => {
  //   console.log(page.getViewport())
  // })
}

window.addEventListener("message", message => {
  if (message.data.source) {
    PDFViewerApplication.open(message.data.source);
  }
});
