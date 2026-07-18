import { orgEmail, orgLocation, orgName, orgPhone } from "@/config";
import { formatUsd } from "@/lib/money";
import {
  formatShippingAddress,
  getOrderTransactionId,
  getPaymentMethodLabel,
} from "@/lib/order-receipt";

const LOGO_SRC = "/images/Woodley Logo Stack.svg";

async function loadLogoPngDataUrl() {
  const res = await fetch(encodeURI(LOGO_SRC));
  if (!res.ok) throw new Error("Could not load logo");
  const svgText = await res.text();
  const blobUrl = URL.createObjectURL(
    new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not render logo"));
      el.src = blobUrl;
    });

    const width = img.naturalWidth || 428;
    const height = img.naturalHeight || 505;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * @param {Record<string, unknown>} order
 */
export async function downloadOrderReceiptPdf(order) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  try {
    const logo = await loadLogoPngDataUrl();
    const logoWidth = 96;
    const logoHeight = logoWidth * (126.15 / 107.03);
    doc.addImage(logo, "PNG", margin, y, logoWidth, logoHeight);
    y += logoHeight + 18;
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(26, 46, 38);
    doc.text(orgName, margin, y + 16);
    y += 32;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 83, 74);
  doc.text(orgPhone, margin, y);
  y += 14;
  doc.text(orgEmail, margin, y);
  y += 14;
  doc.text(orgLocation, margin, y);
  y += 28;

  doc.setTextColor(26, 46, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Order receipt", margin, y);
  y += 24;

  const transactionId = getOrderTransactionId(order);
  const metaLines = [
    `Order number: ${order.id}`,
    `Order date: ${new Date(String(order.createdAt)).toLocaleString()}`,
    `Transaction ID: ${transactionId}`,
    `Payment method: ${getPaymentMethodLabel(order.payment)}`,
    `Customer email: ${order.email}`,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  metaLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 14;
  });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Ship to", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  formatShippingAddress(order)
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      doc.text(String(line), margin, y);
      y += 14;
    });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Items", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");

  const lines = Array.isArray(order.lines) ? order.lines : [];
  lines.forEach((line) => {
    const title = String(line.title || "Item");
    const qty = Number(line.quantity) || 0;
    const lineTotal = formatUsd(Number(line.priceUsd) * qty);
    const row = `${title}  ×${qty}  ${lineTotal}`;
    const wrapped = doc.splitTextToSize(row, contentWidth);
    wrapped.forEach((part) => {
      if (y > 720) {
        doc.addPage();
        y = margin;
      }
      doc.text(part, margin, y);
      y += 14;
    });
  });

  y += 8;
  if (y > 700) {
    doc.addPage();
    y = margin;
  }

  doc.text(`Subtotal: ${formatUsd(Number(order.subtotalUsd))}`, margin, y);
  y += 14;
  const shippingUsd = Number(order.shippingUsd);
  doc.text(
    `Shipping: ${shippingUsd === 0 ? "Complimentary" : formatUsd(shippingUsd)}`,
    margin,
    y,
  );
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${formatUsd(Number(order.totalUsd))}`, margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text(
    "Keep this receipt and your transaction ID for your records.",
    margin,
    y,
  );

  doc.save(`Woodleys-order-${order.id}.pdf`);
}
