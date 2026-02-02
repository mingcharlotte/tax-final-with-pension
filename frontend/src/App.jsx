import React, { useState, useEffect } from 'react';
import '@/App.css';
import { calculateTaxAndNI, generateCalculationSteps } from './utils/taxCalculator';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
import { FileDown, Printer, Calculator, Info } from 'lucide-react';
import { Toaster, toast } from 'sonner';

function App() {
  const [salary, setSalary] = useState(45000);
  const [savings, setSavings] = useState(2000);
  const [dividends, setDividends] = useState(1000);
  const [pensionContribution, setPensionContribution] = useState(0);
  const [pensionType, setPensionType] = useState('Net Pay');
  const [capitalGains, setCapitalGains] = useState(0);
  const [employmentType, setEmploymentType] = useState('Employee');
  const [payVoluntaryNI, setPayVoluntaryNI] = useState(false);
  const [taxData, setTaxData] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);

  useEffect(() => {
    calculateResults();
  }, [salary, savings, dividends, pensionContribution, pensionType, capitalGains, employmentType, payVoluntaryNI]);

  const calculateResults = () => {
    const result = calculateTaxAndNI(
      parseFloat(salary) || 0,
      parseFloat(savings) || 0,
      parseFloat(dividends) || 0,
      employmentType,
      payVoluntaryNI,
      parseFloat(pensionContribution) || 0,
      pensionType,
      parseFloat(capitalGains) || 0
    );
    setTaxData(result);
    
    const steps = generateCalculationSteps(
      parseFloat(salary) || 0,
      parseFloat(savings) || 0,
      parseFloat(dividends) || 0,
      employmentType,
      payVoluntaryNI,
      parseFloat(pensionContribution) || 0,
      pensionType,
      parseFloat(capitalGains) || 0
    );
    setCalculationSteps(steps);
  };

  const handleExportCSV = () => {
    if (taxData) {
      exportToCSV(taxData, { salary, savings, dividends, employmentType });
      toast.success('Tax statement exported to CSV');
    }
  };

  const handleExportPDF = () => {
    if (taxData) {
      exportToPDF(taxData, { salary, savings, dividends, employmentType }, calculationSteps);
      toast.success('Tax statement exported to PDF');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog');
  };

  const formatCurrency = (value) => {
    return `£${parseFloat(value || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-[#0F172A] text-white py-6 px-4 md:px-8 no-print">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-['Manrope'] tracking-tight">
                UK Tax Calculator
              </h1>
              <p className="text-sm text-slate-300 mt-1">2025/26 Tax Year by CSM</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 print-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Input Section - Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 rounded-xl" data-testid="input-section">
              <h2 className="text-xl font-bold font-['Manrope'] tracking-tight mb-6 text-slate-900">
                Income Details
              </h2>
              
              <div className="space-y-5">
                {/* Annual Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-sm font-medium text-slate-700">
                    Annual Salary (for self-employed = payfrom all employments + profit from self-employment)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      £
                    </span>
                    <Input
                      id="salary"
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="pl-7 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                      data-testid="salary-input"
                    />
                  </div>
                </div>

                {/* Savings Interest */}
                <div className="space-y-2">
                  <Label htmlFor="savings" className="text-sm font-medium text-slate-700">
                    Savings Interest
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      £
                    </span>
                    <Input
                      id="savings"
                      type="number"
                      value={savings}
                      onChange={(e) => setSavings(e.target.value)}
                      className="pl-7 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                      data-testid="savings-input"
                    />
                  </div>
                </div>

                {/* Dividend Income */}
                <div className="space-y-2">
                  <Label htmlFor="dividends" className="text-sm font-medium text-slate-700">
                    Dividend Income
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      £
                    </span>
                    <Input
                      id="dividends"
                      type="number"
                      value={dividends}
                      onChange={(e) => setDividends(e.target.value)}
                      className="pl-7 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                      data-testid="dividends-input"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pension Contributions */}
            <Card className="p-6 border-slate-200 rounded-xl" data-testid="pension-section">
              <h2 className="text-xl font-bold font-['Manrope'] tracking-tight mb-6 text-slate-900">
                Pension Contributions
              </h2>
              
              <div className="space-y-5">
                {/* Annual Contribution Amount */}
                <div className="space-y-2">
                  <Label htmlFor="pension" className="text-sm font-medium text-slate-700">
                    Annual Contribution Amount (£)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      £
                    </span>
                    <Input
                      id="pension"
                      type="number"
                      value={pensionContribution}
                      onChange={(e) => setPensionContribution(e.target.value)}
                      className="pl-7 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                      data-testid="pension-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Pension Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Pension Type
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setPensionType('Net Pay')}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all text-left ${
                        pensionType === 'Net Pay'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      data-testid="pension-type-net-pay"
                    >
                      <div className="font-semibold">Net Pay Arrangement</div>
                      <div className="text-xs mt-1 opacity-90">
                        Typically workplace pensions
                      </div>
                    </button>
                    <button
                      onClick={() => setPensionType('Relief at Source')}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all text-left ${
                        pensionType === 'Relief at Source'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      data-testid="pension-type-relief-at-source"
                    >
                      <div className="font-semibold">Relief at Source</div>
                      <div className="text-xs mt-1 opacity-90">
                        Typically private/SIPP pensions
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Capital Gains */}
            <Card className="p-6 border-slate-200 rounded-xl" data-testid="capital-gains-section">
              <h2 className="text-xl font-bold font-['Manrope'] tracking-tight mb-6 text-slate-900">
                Capital Gains
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="capitalGains" className="text-sm font-medium text-slate-700">
                  Total Capital Gains in Year (£)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    £
                  </span>
                  <Input
                    id="capitalGains"
                    type="number"
                    value={capitalGains}
                    onChange={(e) => setCapitalGains(e.target.value)}
                    className="pl-7 h-12 border-slate-200 focus:border-slate-900 focus:ring-slate-900"
                    data-testid="capital-gains-input"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  First £3,000 is tax-free. Rates: 18% (Basic), 24% (Higher)
                </p>
              </div>
            </Card>

            {/* Employment Type */}
            <Card className="p-6 border-slate-200 rounded-xl" data-testid="employment-type-section">
              <h3 className="text-lg font-bold font-['Manrope'] tracking-tight mb-4 text-slate-900">
                Employment Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['Employee', 'Self-Employed', 'Employer'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEmploymentType(type)}
                    className={`px-3 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                      employmentType === type
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    data-testid={`employment-type-${type.toLowerCase().replace(' ', '-')}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Card>

            {/* Class 2 NI Section (Self-Employed Only) */}
            {employmentType === 'Self-Employed' && taxData && taxData.class2Status && (
              <Card className="p-6 border-slate-200 rounded-xl bg-slate-50" data-testid="class2-ni-section">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-slate-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold font-['Manrope'] tracking-tight text-slate-900">
                      Class 2 NI Status
                    </h3>
                    <p className="text-sm text-slate-600 mt-1" data-testid="class2-status">
                      {taxData.class2Status.status}
                    </p>
                  </div>
                </div>
                
                {taxData.class2Status.showToggle && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex-1">
                      <Label htmlFor="voluntary-ni" className="text-sm font-medium text-slate-700">
                        Pay Voluntary Class 2 NI?
                      </Label>
                      <p className="text-xs text-slate-500 mt-1">
                        £189.80/year to maintain NI credits
                      </p>
                    </div>
                    <Switch
                      id="voluntary-ni"
                      checked={payVoluntaryNI}
                      onCheckedChange={setPayVoluntaryNI}
                      data-testid="voluntary-ni-toggle"
                    />
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Results Section - Right Main Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Take-Home Pay Display */}
            {taxData && (
              <Card className="p-8 border-slate-200 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white" data-testid="take-home-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-300 uppercase tracking-wider font-medium mb-2">
                      Annual Take-Home
                    </p>
                    <p className="text-4xl font-bold font-['Manrope'] tracking-tight" data-testid="annual-take-home">
                      {formatCurrency(taxData.takeHome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 uppercase tracking-wider font-medium mb-2">
                      Monthly Take-Home
                    </p>
                    <p className="text-4xl font-bold font-['Manrope'] tracking-tight" data-testid="monthly-take-home">
                      {formatCurrency(taxData.monthlyTakeHome)}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Detailed Tax Statement Table */}
            {taxData && (
              <Card className="p-6 border-slate-200 rounded-xl" data-testid="tax-statement-table">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-['Manrope'] tracking-tight text-slate-900">
                    Detailed Tax Statement
                  </h2>
                  <div className="flex gap-2 no-print">
                    <Button
                      onClick={handleExportCSV}
                      variant="outline"
                      size="sm"
                      className="text-slate-700 border-slate-200 hover:bg-slate-50"
                      data-testid="export-csv-button"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      size="sm"
                      className="text-slate-700 border-slate-200 hover:bg-slate-50"
                      data-testid="export-pdf-button"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="sm"
                      className="text-slate-700 border-slate-200 hover:bg-slate-50"
                      data-testid="print-button"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-['JetBrains_Mono']">
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700">Total Income</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium" data-testid="total-income">
                          {formatCurrency(taxData.totalIncome)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700">Personal Allowance</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium" data-testid="personal-allowance">
                          {formatCurrency(taxData.incomeTax.personalAllowance)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td colSpan="2" className="py-2 px-4 text-xs font-semibold text-slate-600 uppercase">
                          Taxable Income
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Taxable Salary</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.taxableSalary)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Taxable Savings</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.taxableSavings)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Taxable Dividends</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.taxableDividends)}
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td colSpan="2" className="py-2 px-4 text-xs font-semibold text-slate-600 uppercase">
                          Tax & National Insurance
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Income Tax on Salary</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.salaryTax)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Income Tax on Savings</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.savingsTax)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700 pl-8">Income Tax on Dividends</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                          {formatCurrency(taxData.incomeTax.dividendTax)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50 bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-900 font-semibold">Total Income Tax</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-semibold" data-testid="total-income-tax">
                          {formatCurrency(taxData.incomeTax.totalTax)}
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-700">National Insurance</td>
                        <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium" data-testid="national-insurance">
                          {formatCurrency(taxData.nationalInsurance)}
                        </td>
                      </tr>
                      {taxData.pensionContribution > 0 && (
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-700">Pension Contribution</td>
                          <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium" data-testid="pension-contribution">
                            {formatCurrency(taxData.pensionContribution)}
                          </td>
                        </tr>
                      )}
                      {taxData.taxReliefAffectingTakeHome > 0 && (
                        <tr className="border-b border-slate-100 hover:bg-slate-50 bg-green-50">
                          <td className="py-3 px-4 text-sm text-green-700 font-semibold">
                            Higher/Additional Rate Tax Relief
                          </td>
                          <td className="py-3 px-4 text-sm text-green-700 text-right font-semibold" data-testid="pension-tax-relief">
                            -{formatCurrency(taxData.taxReliefAffectingTakeHome)}
                          </td>
                        </tr>
                      )}
                      {taxData.cgt && taxData.cgt.totalCGT > 0 && (
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-700">Capital Gains Tax</td>
                          <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium" data-testid="capital-gains-tax">
                            {formatCurrency(taxData.cgt.totalCGT)}
                          </td>
                        </tr>
                      )}
                      {taxData.voluntaryNICost > 0 && (
                        <tr className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-700">Voluntary Class 2 NI</td>
                          <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                            {formatCurrency(taxData.voluntaryNICost)}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-slate-300 bg-slate-900 text-white">
                        <td className="py-4 px-4 text-base font-bold font-['Manrope']">Total Deductions</td>
                        <td className="py-4 px-4 text-base text-right font-bold font-['Manrope']" data-testid="total-deductions">
                          {formatCurrency(taxData.totalDeductions)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* How This Was Calculated */}
            {calculationSteps.length > 0 && (
              <Card className="p-6 border-slate-200 rounded-xl" data-testid="calculation-breakdown-section">
                <h2 className="text-xl font-bold font-['Manrope'] tracking-tight text-slate-900 mb-4">
                  How This Was Calculated
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {calculationSteps.map((step, index) => (
                    <AccordionItem key={index} value={`step-${index}`} data-testid={`calculation-step-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="text-sm font-semibold text-slate-900">
                            {index + 1}. {step.title}
                          </span>
                          <span className="text-sm font-['JetBrains_Mono'] text-slate-700">
                            {step.value}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4 px-4 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 md:px-8 mt-12 no-print">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <p className="text-sm">
              UK Tax Calculator 2025/26 • Calculations based on current HMRC guidelines
            </p>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed">
                <strong className="text-slate-400">Disclaimer:</strong> This calculator is provided for informational and educational purposes only. 
                While every effort has been made to ensure accuracy, tax calculations can be complex and individual circumstances vary. 
                This tool does not constitute financial, tax, or legal advice. The creator accepts no liability for any loss or damage arising from 
                the use of this calculator or reliance on its results. For personalized tax advice, please consult a qualified tax advisor or accountant. 
                Tax rates and allowances are subject to change by HMRC.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
