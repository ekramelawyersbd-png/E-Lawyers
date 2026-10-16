import { jsPDF } from 'jspdf';
import { TransactionRecord } from '../contexts/PurchaseContext';

export const generatePdfReceipt = (tx: TransactionRecord) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background banner
  doc.setFillColor(241, 245, 249);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Brand Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('ACCOUNTICCA & E-LAWYERS', 20, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Verified Digital Tax & Legal Compliance Shop', 20, 29);

  // Badge: Tax Audit Compliant
  doc.setFillColor(209, 250, 229);
  doc.roundedRect(pageWidth - 65, 14, 45, 12, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text('NBR AUDIT READY', pageWidth - 57, 21);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 45, pageWidth - 20, 45);

  // Receipt Title & Meta box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL DIGITAL PAYMENT RECEIPT', 20, 58);

  // Metadata block
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 65, pageWidth - 40, 36, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 65, pageWidth - 40, 36, 3, 3, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);

  const col1X = 26;
  const col2X = 115;

  doc.text(`Receipt Reference:`, col1X, 74);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(tx.id, col1X + 35, 74);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Gateway TrxID:`, col1X, 82);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(tx.transactionId, col1X + 35, 82);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Order Reference:`, col1X, 90);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(tx.referenceId || 'ACC-2026-REF', col1X + 35, 90);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Date & Time:`, col2X, 74);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date(tx.date).toLocaleString('en-GB'), col2X + 28, 74);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Payment Status:`, col2X, 82);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(tx.status.toUpperCase(), col2X + 28, 82);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Payment Method:`, col2X, 90);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(tx.paymentMethod, col2X + 28, 90);

  // Purchased Items Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(20, 112, pageWidth - 40, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION OF DIGITAL COMPLIANCE PRODUCT', 26, 118);
  doc.text('AMOUNT (BDT)', pageWidth - 45, 118, { align: 'right' });

  // Item Row
  doc.setFillColor(255, 255, 255);
  doc.rect(20, 122, pageWidth - 40, 18, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, 122, pageWidth - 40, 18, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(tx.productTitle, 26, 131);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Instant Digital Download & Access License included', 26, 137);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`BDT ${tx.amount.toLocaleString('en-IN')}`, pageWidth - 26, 133, { align: 'right' });

  // Totals Box
  const totalY = 148;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - 90, totalY, 70, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(pageWidth - 90, totalY, 70, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Subtotal:', pageWidth - 84, totalY + 7);
  doc.text(`BDT ${tx.amount.toLocaleString('en-IN')}`, pageWidth - 26, totalY + 7, { align: 'right' });

  doc.text('VAT / Tax (0%):', pageWidth - 84, totalY + 14);
  doc.text('BDT 0', pageWidth - 26, totalY + 14, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('Total Paid:', pageWidth - 84, totalY + 21);
  doc.text(`BDT ${tx.amount.toLocaleString('en-IN')}`, pageWidth - 26, totalY + 21, { align: 'right' });

  // Merchant Details Box at Bottom
  const merchantY = 185;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, merchantY, pageWidth - 40, 45, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, merchantY, pageWidth - 40, 45, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Accounticca Advisory & eLawyers Bangladesh', 26, merchantY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Dhaka Chamber Building (2nd Floor), Motijheel C/A, Dhaka-1000', 26, merchantY + 15);
  doc.text('Hotline: +88 01335230170 | Email: support@accounticca.com', 26, merchantY + 22);
  doc.text('Tax Identification Number (TIN): 482910283401 | VAT Reg No: 003928102-0101', 26, merchantY + 29);
  doc.text('Gateway Integration: UddoktaPay Secure Payment Gateway API', 26, merchantY + 36);

  // Footer seal notice
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This is a verified computer-generated PDF receipt backed by Firestore transaction metadata. Valid for NBR tax audit records.',
    pageWidth / 2,
    merchantY + 53,
    { align: 'center' }
  );

  // Save PDF
  doc.save(`Receipt-${tx.transactionId}.pdf`);
};
