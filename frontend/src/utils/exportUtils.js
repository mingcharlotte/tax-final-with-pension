import jsPDF from 'jspdf';

// Export to CSV
export const exportToCSV = (taxData, inputs) => {
  const { salary, savings, dividends, employmentType } = inputs;
  const { totalIncome, takeHome, monthlyTakeHome, incomeTax, nationalInsurance, voluntaryNICost, totalDeductions } = taxData;
  
  const rows = [
    ['UK Tax Calculator 2026/27 - Tax Statement'],
    [''],
    ['Input Summary'],
    ['Annual Salary', `£${salary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Savings Interest', `£${savings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Dividend Income', `£${dividends.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Employment Type', employmentType],
    [''],
    ['Tax Breakdown'],
    ['Total Income', `£${totalIncome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Personal Allowance', `£${incomeTax.personalAllowance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    [''],
    ['Taxable Income'],
    ['Taxable Salary', `£${incomeTax.taxableSalary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Taxable Savings', `£${incomeTax.taxableSavings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Taxable Dividends', `£${incomeTax.taxableDividends.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    [''],
    ['Tax & National Insurance'],
    ['Income Tax on Salary', `£${incomeTax.salaryTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Income Tax on Savings', `£${incomeTax.savingsTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Income Tax on Dividends', `£${incomeTax.dividendTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Total Income Tax', `£${incomeTax.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['National Insurance', `£${nationalInsurance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
  ];
  
  if (voluntaryNICost > 0) {
    rows.push(['Voluntary Class 2 NI', `£${voluntaryNICost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]);
  }
  
  rows.push(
    ['Total Deductions', `£${totalDeductions.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    [''],
    ['Take-Home Pay'],
    ['Annual Take-Home', `£${takeHome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Monthly Take-Home', `£${monthlyTakeHome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]
  );
  
  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `uk-tax-statement-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF
export const exportToPDF = (taxData, inputs, calculationSteps) => {
  const { salary, savings, dividends, employmentType } = inputs;
  const { totalIncome, takeHome, monthlyTakeHome, incomeTax, nationalInsurance, voluntaryNICost, totalDeductions } = taxData;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 20;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('UK Tax Statement 2026/27', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Input Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Input Summary', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Annual Salary: £${salary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, yPos);
  yPos += 6;
  doc.text(`Savings Interest: £${savings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, yPos);
  yPos += 6;
  doc.text(`Dividend Income: £${dividends.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, yPos);
  yPos += 6;
  doc.text(`Employment Type: ${employmentType}`, 20, yPos);
  yPos += 12;
  
  // Take-Home Pay (Highlighted)
  doc.setFillColor(15, 23, 42); // Navy background
  doc.rect(20, yPos - 5, pageWidth - 40, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Take-Home Pay:', 25, yPos + 3);
  doc.text(`£${takeHome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 25, yPos + 3, { align: 'right' });
  doc.text('Monthly Take-Home Pay:', 25, yPos + 10);
  doc.text(`£${monthlyTakeHome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, pageWidth - 25, yPos + 10, { align: 'right' });
  yPos += 25;
  
  doc.setTextColor(0, 0, 0);
  
  // Tax Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Tax Breakdown', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const breakdownItems = [
    ['Total Income', `£${totalIncome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Personal Allowance', `£${incomeTax.personalAllowance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['', ''],
    ['Taxable Salary', `£${incomeTax.taxableSalary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Income Tax on Salary', `£${incomeTax.salaryTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['', ''],
    ['Taxable Savings', `£${incomeTax.taxableSavings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Income Tax on Savings', `£${incomeTax.savingsTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['', ''],
    ['Taxable Dividends', `£${incomeTax.taxableDividends.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['Income Tax on Dividends', `£${incomeTax.dividendTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['', ''],
    ['Total Income Tax', `£${incomeTax.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
    ['National Insurance', `£${nationalInsurance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
  ];
  
  if (voluntaryNICost > 0) {
    breakdownItems.push(['Voluntary Class 2 NI', `£${voluntaryNICost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]);
  }
  
  breakdownItems.push(['', '']);
  breakdownItems.push(['Total Deductions', `£${totalDeductions.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`]);
  
  breakdownItems.forEach(([label, value]) => {
    if (label === '') {
      yPos += 3;
    } else {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(label, 20, yPos);
      if (value) {
        doc.text(value, pageWidth - 20, yPos, { align: 'right' });
      }
      yPos += 6;
    }
  });
  
  // Save PDF
  doc.save(`uk-tax-statement-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Print function
export const printTaxStatement = () => {
  window.print();
};
