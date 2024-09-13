import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateReceiptPDF = (receiptData) => {
  const doc = new jsPDF();

  const headerStyle = { fontSize: 18, fontStyle: 'bold' };
  const invoiceStyle = { fontSize: 15, fontStyle: 'bold' };
  const sectionHeaderStyle = { fontSize: 12, fontStyle: 'bold' };
  const companyDetailsStyle = { fontSize: 12, fontStyle: 'normal' };
  const itemStyle = { fontSize: 12 };

  doc.setFont(headerStyle.fontStyle, 'normal');
  doc.setFontSize(headerStyle.fontSize);
  doc.text(`${receiptData.transaction_details.organization_name || ''}`, 105, 20, null, null, 'center');

  doc.setFont(companyDetailsStyle.fontStyle, 'normal');
  doc.setFontSize(companyDetailsStyle.fontSize);
  doc.text(`Address: ${receiptData.transaction_details.organization_address || ''}`, 105, 28, null, null, 'center');
  doc.text(`Email: ${receiptData.transaction_details.organization_email || ''}`, 105, 36, null, null, 'center');
  doc.text(`Phone No: ${receiptData.transaction_details.organization_phone_number || ''}`, 105, 44, null, null, 'center');

  doc.setFont(invoiceStyle.fontStyle, 'normal');
  doc.setFontSize(invoiceStyle.fontSize);
  doc.text('RECEIPT', 105, 55, null, null, 'center');

  doc.setFont(sectionHeaderStyle.fontStyle, 'normal');
  doc.setFontSize(sectionHeaderStyle.fontSize);
  doc.text(`Branch Name: ${receiptData.transaction_details.branch_name || ''}`, 20, 70);
  doc.text(`Branch Address: ${receiptData.transaction_details.branch_address || ''}`, 20, 78);
  doc.text(`Branch Phone Number: ${receiptData.transaction_details.branch_phone_number || ''}`, 20, 86);
  doc.text(`Customer Name: ${receiptData.transaction_details.customer_detail || ''}`, 20, 102);
  doc.text(`Customer PhoneNum: ${receiptData.transaction_details.customer_phone_number || ''}`, 20, 112);
  doc.text(`Transaction ID: ${receiptData.transaction_details.transaction_id || ''}`, 20, 122);
  doc.text(`Payment Method: ${receiptData.transaction_details.payment_method || ''}`, 20, 132);
  doc.text(`Date: ${receiptData.transaction_details.created_at || ''}`, 20, 142);

  const tableColumn = ["Product Name", "Price(NGN)", "Quantity", "VAT", "Total Price(NGN)"];
  const tableRows = [];
  let totalVAT = 0;  // Track total VAT

  receiptData.items.forEach((item) => {
    const vatAmount = item.vat_state === 'yes' ? item.price_sold_at * 0.075 : 0;  // 7.5% VAT
    const totalPrice = item.price_sold_at * item.quantity + vatAmount;
    totalVAT += vatAmount;

    const itemData = [
      item.product_type_name || '',
      formatNumber(item.price_sold_at),
      item.quantity || '',
      item.vat_state === 'yes' ?  vatAmount : 0,  // Correctly display "Yes" or "No" based on VAT
      formatNumber(totalPrice)  // Include VAT in total price
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 152,
    styles: {
      fontSize: itemStyle.fontSize,
      lineColor: [0, 0, 0], // Black border
      lineWidth: 0.1,
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0] // Black text color
    },
    theme: 'grid', // Ensure all cells have borders
  });

  let finalY = doc.autoTable.previous.finalY + 10;
  doc.setFont(invoiceStyle.fontStyle);
  doc.setFontSize(invoiceStyle.fontSize);

  // Display total VAT and total amount with VAT included
  doc.text(`Total VAT (NGN): ${formatNumber(totalVAT.toFixed(2))}`, doc.internal.pageSize.width - 20, finalY, null, null, 'right');
  doc.text(`Total Amount (NGN): ${formatNumber(receiptData.transaction_details.transaction_amount?.toFixed(2) || '0.00')}`, doc.internal.pageSize.width - 20, finalY + 10, null, null, 'right');

  doc.setFontSize(itemStyle.fontSize);
  doc.text('Thanks for your patronage!', 105, finalY + 25, null, null, 'center');

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
    iframe.contentWindow.focus();  // Focus the iframe window
    iframe.contentWindow.print();  // Trigger the print dialog
  };
};

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

