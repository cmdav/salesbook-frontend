// utils/sendToPrinter.js
import { createPDFContent } from './generatePdf';

export const sendToPrinter = (receiptData) => {
  const doc = createPDFContent(receiptData);

  // Generate the PDF as a Blob
  const pdfBlob = doc.output('blob');

  // Create an iframe to load the PDF and trigger the print dialog
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  // Load the PDF into the iframe
  iframe.src = URL.createObjectURL(pdfBlob);

  // Trigger the print dialog once the iframe has loaded the PDF
  iframe.onload = () => {
    iframe.contentWindow.focus(); // Focus the iframe window
    iframe.contentWindow.print(); // Trigger the print dialog
  };
};
