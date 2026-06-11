// PDF report generator using jsPDF + autoTable

export async function generatePDF({ type, formData, results, effectiveLimits }) {
  const { default: jsPDF } = await import("jspdf")
  await import("jspdf-autotable")

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 18
  const green = [15, 110, 86]
  const red = [163, 45, 45]
  const amber = [133, 79, 11]
  const gray = [90, 90, 90]
  const lightGray = [245, 245, 245]
  const white = [255, 255, 255]
  const dark = [30, 30, 30]

  const totalIssues = results.issues.length
  const totalWarnings = results.warnings.length
  const totalPassed = results.passed.length
  const overallOk = totalIssues === 0

  // Header bar
  doc.setFillColor(...green)
  doc.rect(0, 0, pageW, 22, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text("DBH — NRB Compliance Report", margin, 10)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("NRB Lending Guideline · June 2026", margin, 16)
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, pageW - margin, 16, { align: "right" })

  let y = 30

  // File type badge
  doc.setFillColor(...lightGray)
  doc.roundedRect(margin, y, 80, 9, 2, 2, "F")
  doc.setTextColor(...gray)
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text(type === "remittance" ? "REMITTANCE INCOME FILE" : "REGULAR INCOME FILE", margin + 4, y + 6)

  // Verdict badge
  const verdictColor = overallOk ? green : red
  doc.setFillColor(...verdictColor)
  doc.roundedRect(pageW - margin - 60, y, 60, 9, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  const verdictText = overallOk ? `COMPLIED — ${totalPassed} checks passed` : `${totalIssues} ISSUE${totalIssues > 1 ? "S" : ""} FOUND`
  doc.text(verdictText, pageW - margin - 30, y + 6, { align: "center" })

  y += 16

  // Summary cards
  const cardW = (pageW - margin * 2 - 8) / 3
  const cards = [
    { label: "Passed", val: totalPassed, color: green },
    { label: "Warnings", val: totalWarnings, color: amber },
    { label: "Issues", val: totalIssues, color: red },
  ]
  cards.forEach((c, i) => {
    const cx = margin + i * (cardW + 4)
    doc.setFillColor(...c.color.map(v => Math.min(255, v + 180)))
    doc.roundedRect(cx, y, cardW, 14, 2, 2, "F")
    doc.setTextColor(...c.color)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text(String(c.val), cx + cardW / 2, y + 9, { align: "center" })
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.text(c.label, cx + cardW / 2, y + 13, { align: "center" })
  })

  y += 22

  // Profile summary
  if (Object.keys(formData).length > 0) {
    doc.setFillColor(...lightGray)
    doc.rect(margin, y, pageW - margin * 2, 7, "F")
    doc.setTextColor(...dark)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text("FILE PROFILE SUMMARY", margin + 3, y + 5)
    y += 10
    const profileRows = Object.entries(formData)
      .filter(([, v]) => v !== "" && v !== undefined && v !== null)
      .map(([k, v]) => [k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()), String(v)])
    if (profileRows.length > 0) {
      doc.autoTable({
        startY: y,
        head: [],
        body: profileRows,
        theme: "plain",
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 55, textColor: gray }, 1: { textColor: dark } },
        margin: { left: margin, right: margin },
      })
      y = doc.lastAutoTable.finalY + 6
    }
  }

  // Effective limits (regular files)
  if (effectiveLimits && type === "regular") {
    doc.setFillColor(...lightGray)
    doc.rect(margin, y, pageW - margin * 2, 7, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(...dark)
    doc.text("APPLICABLE LIMITS FOR THIS PROFILE", margin + 3, y + 5)
    y += 10
    doc.autoTable({
      startY: y,
      head: [],
      body: [
        ["Max LCR", `${effectiveLimits.maxLCR}%`],
        ["Max FOIR", `${effectiveLimits.maxFOIR}%`],
        ["Max Tenor", `${effectiveLimits.maxTenor} years`],
        ["LCP", effectiveLimits.lcpMandatory ? "Mandatory" : "Generally Required"],
        ["Credit Report", effectiveLimits.creditReportRequired ? "Required" : "Not required"],
      ],
      theme: "plain",
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 55, textColor: gray }, 1: { textColor: dark } },
      margin: { left: margin, right: margin },
    })
    y = doc.lastAutoTable.finalY + 6
  }

  // Compliance checks table
  const allChecks = [
    ...results.issues.map(r => ({ ...r, status: "Issue" })),
    ...results.warnings.map(r => ({ ...r, status: "Warning" })),
    ...results.passed.map(r => ({ ...r, status: "Complied" })),
  ]

  if (allChecks.length > 0) {
    doc.setFillColor(...lightGray)
    doc.rect(margin, y, pageW - margin * 2, 7, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(...dark)
    doc.text("COMPLIANCE CHECK DETAILS", margin + 3, y + 5)
    y += 4

    doc.autoTable({
      startY: y,
      head: [["Check", "Detail", "Status"]],
      body: allChecks.map(c => [c.field || "", c.msg || "", c.status]),
      theme: "striped",
      headStyles: { fillColor: dark, textColor: white, fontSize: 8, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 42, textColor: dark },
        1: { cellWidth: "auto", textColor: gray },
        2: { cellWidth: 22, fontStyle: "bold", halign: "center" },
      },
      didParseCell(data) {
        if (data.column.index === 2 && data.section === "body") {
          const v = data.cell.raw
          if (v === "Issue") data.cell.styles.textColor = red
          else if (v === "Warning") data.cell.styles.textColor = amber
          else data.cell.styles.textColor = green
        }
      },
      margin: { left: margin, right: margin },
    })
  }

  // Footer
  const footerY = pageH - 10
  doc.setFillColor(...green)
  doc.rect(0, footerY - 4, pageW, 14, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.text("DBH NRB Compliance Checker · Internal Use Only · NRB Lending Guideline June 2026", pageW / 2, footerY + 2, { align: "center" })

  doc.save(`NRB_Compliance_Report_${type}_${Date.now()}.pdf`)
}
