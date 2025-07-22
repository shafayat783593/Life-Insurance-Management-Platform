import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generatePolicyPdf(policy, user) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]); // bigger height for more content
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Title (bold)
    page.drawText("Policy Document", {
        x: 200,
        y: height - 40,
        size: 22,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.7),
    });

    // Helper to draw label and value pairs
    function drawLine(label, value, y) {
        page.drawText(label, {
            x: 50,
            y,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
        });
        page.drawText(value, {
            x: 200,
            y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
        });
    }

    let currentY = height - 80;
    const lineGap = 20;

    drawLine("Policy ID:", policy._id || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Policy Title:", policy.policyData?.title || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Category:", policy.policyData?.category || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Description:", policy.policyData?.description || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Coverage Amount:", policy.quote?.coverageAmount?.toString() || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Duration (years):", policy.quote?.duration?.toString() || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Monthly Premium:", `$${policy.quote?.monthly || "N/A"}`, currentY);
    currentY -= lineGap;
    drawLine("Annual Premium:", `$${policy.quote?.annual || "N/A"}`, currentY);
    currentY -= lineGap;
    drawLine("Payment Status:", policy.paymentStatus || "N/A", currentY);
    currentY -= lineGap;

    drawLine("Customer Name:", user.displayName || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Email:", user.email || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Address:", policy.address || "N/A", currentY);
    currentY -= lineGap;
    drawLine("NID:", policy.nid || "N/A", currentY);
    currentY -= lineGap;

    drawLine("Nominee:", `${policy.nomineeName || "N/A"} (${policy.nomineeRelation || "N/A"})`, currentY);
    currentY -= lineGap;

    // healthDisclosure is array, join values
    const health = Array.isArray(policy.healthDisclosure) ? policy.healthDisclosure.join(", ") : "N/A";
    drawLine("Health Disclosure:", health, currentY);
    currentY -= lineGap;

    drawLine("Status:", policy.status || "N/A", currentY);
    currentY -= lineGap;

    drawLine("Submitted At:", policy.submittedAt ? new Date(policy.submittedAt).toLocaleString() : "N/A", currentY);
    currentY -= lineGap;
    drawLine("Assigned Agent:", policy.assignedAgent || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Transaction ID:", policy.transactionId || "N/A", currentY);
    currentY -= lineGap;
    drawLine("Purchase Count:", policy.policyData?.purchaseCount?.toString() || "N/A", currentY);
    currentY -= lineGap;

    drawLine("Rejected At:", policy.rejectedAt ? new Date(policy.rejectedAt).toLocaleString() : "N/A", currentY);
    currentY -= lineGap;
    drawLine("Rejection Feedback:", policy.rejectionFeedback || "N/A", currentY);
    currentY -= lineGap;

    // Save and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy.policyData?.title || "policy"}_document.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}
