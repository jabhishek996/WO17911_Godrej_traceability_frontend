import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Downloads a section of the page as a PDF using the element's class or ID.
 * @param {string} selector - A CSS selector to select the element (e.g., '#pdf-content' or '.my-class').
 * @param {string} [filePrefix='report'] - Prefix for the saved PDF file name.
 */
const downloadPDF = async (selector, filePrefix = "report") => {
  const input = document.querySelector(selector);
  if (!input) {
    console.warn(`Element not found: ${selector}`);
    return;
  }

  const header = input.querySelector(".pdf-header-only");
  if (header) header.style.display = "block";

  const canvas = await html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  if (header) header.style.display = "none";

  const imgData = canvas.toDataURL("image/jpeg", 0.7);
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const padding = 20;
  const imgWidth = pageWidth - 2 * padding;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = padding;

  pdf.addImage(imgData, "JPEG", padding, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    pdf.addPage();
    position = 0;
    pdf.addImage(imgData, "JPEG", padding, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, "_").replace(/:/g, "-").replace(/\..+/, "");
  pdf.save(`${filePrefix}_${timestamp}.pdf`);
};

export default downloadPDF;
