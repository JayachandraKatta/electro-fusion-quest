import jsPDF from 'jspdf';
import { Order } from '../contexts/AppContext';

export const generateInvoicePDF = (order: Order): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(0, 123, 255); // Tech Blue
  doc.text('Electro Fusion', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('One stop solution for all electronics items', 20, 40);
  
  // Invoice Details
  doc.setFontSize(18);
  doc.text('Invoice', 20, 60);
  
  doc.setFontSize(12);
  doc.text(`Order ID: ${order.id}`, 20, 75);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 85);
  doc.text(`Status: ${order.status}`, 20, 95);
  
  // Customer Details
  doc.text('Bill To:', 20, 115);
  doc.text(`${order.address.name}`, 20, 125);
  doc.text(`${order.address.email}`, 20, 135);
  doc.text(`${order.address.phone}`, 20, 145);
  doc.text(`${order.address.street}`, 20, 155);
  doc.text(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, 20, 165);
  if (order.address.landmark) {
    doc.text(`Landmark: ${order.address.landmark}`, 20, 175);
  }
  
  // Items Table Header
  const startY = 200;
  doc.setFontSize(12);
  doc.text('Item', 20, startY);
  doc.text('Qty', 120, startY);
  doc.text('Price', 150, startY);
  doc.text('Total', 180, startY);
  
  // Draw line under header
  doc.line(20, startY + 5, 200, startY + 5);
  
  // Items
  let currentY = startY + 20;
  order.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    
    doc.setFontSize(10);
    doc.text(item.name.substring(0, 30), 20, currentY);
    doc.text(item.brand, 20, currentY + 10);
    doc.text(item.quantity.toString(), 120, currentY);
    doc.text(`₹${item.price.toLocaleString()}`, 150, currentY);
    doc.text(`₹${itemTotal.toLocaleString()}`, 180, currentY);
    
    currentY += 25;
  });
  
  // Total
  doc.line(20, currentY, 200, currentY);
  currentY += 15;
  
  doc.setFontSize(14);
  doc.text(`Total Amount: ₹${order.total.toLocaleString()}`, 20, currentY);
  doc.text(`Payment Method: ${order.paymentMethod}`, 20, currentY + 15);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for shopping with Electro Fusion!', 20, 280);
  doc.text('Expected delivery: 2 days from order date', 20, 290);
  
  // Save the PDF
  doc.save(`ElectroFusion_Invoice_${order.id}.pdf`);
};

export const downloadInvoice = (order: Order): void => {
  generateInvoicePDF(order);
};