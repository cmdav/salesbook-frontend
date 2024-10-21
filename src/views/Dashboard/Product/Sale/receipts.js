// utils/receipt.js
import { createPDFContent } from './generatePdf';

export const generateReceiptPDF = (receiptData) => {
  const doc = createPDFContent(receiptData);

  const pdfDataUri = doc.output('datauristring');
  const viewerWindow = window.open();
  viewerWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
};
