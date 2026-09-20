import jsPDF from 'jspdf';

/**
 * Generates and triggers download of an official PDF Complaint Receipt for CivicPulse.
 * @param {Object} complaint - The complaint object
 * @param {Object} [user] - Optional user object
 */
export function generateComplaintReceiptPDF(complaint, user) {
  if (!complaint) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const c = complaint;
  const rawId = c.id || c._id || 'CP-0000';
  const idStr = String(rawId).startsWith('CP-') ? String(rawId) : `CP-${String(rawId).slice(-6).toUpperCase()}`;

  const dateStr = c.submittedAt || c.createdAt
    ? new Date(c.submittedAt || c.createdAt).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : new Date().toLocaleString();

  const primaryColor = [15, 23, 42]; // Slate 900
  const brandBlue = [2, 132, 199];   // Sky 600
  const bgLight = [248, 250, 252];    // Slate 50

  // 1. Top Decorative Accent Line
  doc.setFillColor(...brandBlue);
  doc.rect(0, 0, 210, 5, 'F');

  // 2. Header Box
  doc.setFillColor(...bgLight);
  doc.rect(15, 12, 180, 28, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 12, 180, 28, 'S');

  // Logo Icon Badge
  doc.setFillColor(...brandBlue);
  doc.roundedRect(22, 17, 18, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CP', 31, 28.5, { align: 'center' });

  // Main Header Titles
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CIVICPULSE MUNICIPAL PORTAL', 46, 23);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Official Civic Grievance Resolution & Tracking Receipt', 46, 31);

  // Receipt Reference Badge (Right)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(142, 16, 48, 20, 2, 2, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TRACKING REF ID', 166, 22, { align: 'center' });
  doc.setTextColor(...brandBlue);
  doc.setFontSize(11);
  doc.text(idStr, 166, 30, { align: 'center' });

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(15, 45, 195, 45);

  // 3. Status and Overview Header
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('1. Grievance Overview & Particulars', 15, 53);

  const statusStr = String(c.status || 'Pending').toUpperCase();
  let statusBg = [234, 179, 8]; // Amber
  if (statusStr.includes('RESOLV') || statusStr.includes('SOLVE')) statusBg = [16, 185, 129];
  else if (statusStr.includes('PROG')) statusBg = [59, 130, 246];
  else if (statusStr.includes('REJECT')) statusBg = [239, 68, 68];

  doc.setFillColor(...statusBg);
  doc.roundedRect(142, 47, 48, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`STATUS: ${c.status || 'Pending'}`, 166, 52.5, { align: 'center' });

  // Grid Details Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 58, 180, 52, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 58, 180, 52, 2, 2, 'S');

  const col1LblX = 20, col1ValX = 58;
  const col2LblX = 110, col2ValX = 148;
  let y = 66;

  const renderRow = (l1, v1, l2, v2, curY) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(l1, col1LblX, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(v1 || 'N/A'), col1ValX, curY);

    if (l2) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(l2, col2LblX, curY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(String(v2 || 'N/A'), col2ValX, curY);
    }
  };

  renderRow('Complaint ID:', idStr, 'Date Filed:', dateStr, y);
  y += 10;
  renderRow('Category:', c.category || 'General Municipal', 'Department:', c.department || 'Public Works', y);
  y += 10;
  renderRow('Location / Ward:', c.location || 'City Limits', 'Priority Level:', c.priority || c.urgency || 'Medium', y);
  y += 10;
  renderRow('Submitted By:', c.userName || c.submittedBy || user?.name || 'Citizen', 'Auth Channel:', 'Verified Portal Account', y);

  // 4. Subject & Detailed Description Box
  y = 118;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('2. Complaint Subject & Description', 15, y);

  y += 5;
  const hasImage = Boolean(c.image || c.imageUrl);
  const descBoxHeight = hasImage ? 34 : 40;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, descBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...brandBlue);
  doc.text(`Title: ${c.title || 'Civic Issue Report'}`, 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const splitText = doc.splitTextToSize(c.description || 'No detailed description specified.', 170);
  doc.text(splitText, 20, y + 14);

  y += descBoxHeight + 6;

  // Optional: Attached Photo Proof Section
  if (hasImage) {
    const photoImg = c.image || c.imageUrl;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('3. Attached Photo Proof (Field Evidence)', 15, y);

    y += 5;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 36, 2, 2, 'FD');

    try {
      const imgFormat = photoImg.includes('png') || photoImg.includes('PNG') ? 'PNG' : 'JPEG';
      doc.addImage(photoImg, imgFormat, 20, y + 3, 48, 30);
    } catch (e) {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('[Image attached - Preview unrenderable]', 22, y + 18);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...brandBlue);
    doc.text('Citizen Photographic Evidence Attached', 74, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Photographic evidence uploaded by citizen at submission.', 74, y + 17);
    doc.text('Inspection Status: Verified & archived in municipal ledger.', 74, y + 24);

    y += 42;
  }

  // Official Officer Resolution Note
  const secNumber = hasImage ? '4' : '3';
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`${secNumber}. Official Resolution & Inspection Status`, 15, y);

  y += 5;
  const resBoxHeight = hasImage ? 26 : 30;
  const hasNote = Boolean(c.officerNote || c.resolutionNote);
  if (hasNote || c.status === 'Resolved') {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(15, y, 180, resBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(22, 101, 52);
    doc.text('OFFICER RESOLUTION UPDATE:', 20, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(21, 128, 61);
    const note = c.officerNote || c.resolutionNote || 'Issue has been inspected and resolved by municipal staff.';
    const splitNote = doc.splitTextToSize(`"${note}"`, 170);
    doc.text(splitNote, 20, y + 14);
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 180, resBoxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Status: Active grievance under processing by municipal authority.', 20, y + 10);
    doc.text('Official notes will be appended upon inspection by the assigned officer.', 20, y + 17);
  }

  // Stamp & Validation
  y += resBoxHeight + 8;
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.7);
  doc.roundedRect(125, y, 70, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...brandBlue);
  doc.text('OFFICIAL MUNICIPAL STAMP', 160, y + 6, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('ELECTRONICALLY ACKNOWLEDGED', 160, y + 12, { align: 'center' });
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(8);
  doc.text('✔ VALIDATED ACKNOWLEDGMENT', 160, y + 18, { align: 'center' });

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, 268, 195, 268);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('This is an official computer-generated receipt issued by CivicPulse Smart Governance Portal.', 105, 273, { align: 'center' });
  doc.text('Toll-Free Helpline: 1800-234-CIVIC | Website: http://localhost:8085', 105, 278, { align: 'center' });

  // Save PDF file
  const fileName = `CivicPulse_Receipt_${idStr}.pdf`;
  doc.save(fileName);
}
