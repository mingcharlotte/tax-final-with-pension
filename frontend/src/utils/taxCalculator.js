// UK Tax Calculator for 2026/27 Tax Year

// Constants for 2026/27
const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;
const STARTING_RATE_SAVINGS = 5000;
const DIVIDEND_ALLOWANCE = 500;
const CLASS_2_VOLUNTARY_COST = 189.80;
const CLASS_2_SMALL_PROFIT_THRESHOLD = 7105;
const NI_LOWER_LIMIT = 12570;
const NI_UPPER_LIMIT = 50270;
const EMPLOYER_NI_THRESHOLD = 5000;

// Calculate Personal Allowance (reduces when income > £100k)
export const calculatePersonalAllowance = (totalIncome) => {
  if (totalIncome <= 100000) return PERSONAL_ALLOWANCE;
  const reduction = Math.floor((totalIncome - 100000) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
};

// Calculate Starting Rate for Savings Band
export const calculateStartingRateForSavings = (salaryAfterPA) => {
  if (salaryAfterPA <= 0) return STARTING_RATE_SAVINGS;
  return Math.max(0, STARTING_RATE_SAVINGS - salaryAfterPA);
};

// Calculate Personal Savings Allowance based on tax band
export const calculatePSA = (taxableNonSavingsIncome) => {
  if (taxableNonSavingsIncome <= BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE) {
    return 1000; // Basic rate taxpayer
  } else if (taxableNonSavingsIncome <= HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE) {
    return 500; // Higher rate taxpayer
  }
  return 0; // Additional rate taxpayer
};

// Calculate Income Tax with Pension Contributions
export const calculateIncomeTax = (salary, savings, dividends, pensionContribution = 0, pensionType = 'Net Pay') => {
  let adjustedSalary = salary;
  let basicRateLimit = BASIC_RATE_LIMIT;
  let pensionTaxRelief = 0;
  
  // Handle pension contributions
  if (pensionContribution > 0) {
    if (pensionType === 'Net Pay') {
      // Net Pay: Reduce salary before tax calculation
      adjustedSalary = salary - pensionContribution;
    } else if (pensionType === 'Relief at Source') {
      // Relief at Source: Gross up and extend basic rate band
      const grossedUpContribution = pensionContribution / 0.8;
      basicRateLimit = BASIC_RATE_LIMIT + grossedUpContribution;
    }
  }
  
  const totalIncome = adjustedSalary + savings + dividends;
  const personalAllowance = calculatePersonalAllowance(totalIncome);
  
  // Beneficial Ordering: Apply PA to Salary first, then Savings, then Dividends
  let remainingPA = personalAllowance;
  let taxableSalary = 0;
  let taxableSavings = 0;
  let taxableDividends = 0;
  
  // Apply PA to Salary first
  if (adjustedSalary > remainingPA) {
    taxableSalary = adjustedSalary - remainingPA;
    remainingPA = 0;
  } else {
    remainingPA -= adjustedSalary;
  }
  
  // Apply remaining PA to Savings
  if (remainingPA > 0) {
    if (savings > remainingPA) {
      taxableSavings = savings - remainingPA;
      remainingPA = 0;
    } else {
      remainingPA -= savings;
    }
  } else {
    taxableSavings = savings;
  }
  
  // Apply remaining PA to Dividends
  if (remainingPA > 0) {
    if (dividends > remainingPA) {
      taxableDividends = dividends - remainingPA;
    }
  } else {
    taxableDividends = dividends;
  }
  
  // Calculate Starting Rate for Savings
  const startingRateForSavings = calculateStartingRateForSavings(taxableSalary);
  
  // Calculate PSA based on taxable non-savings income
  const psa = calculatePSA(taxableSalary);
  
  // Calculate tax on Salary (non-savings income)
  let salaryTax = 0;
  if (taxableSalary > 0) {
    const adjustedBasicLimit = basicRateLimit - PERSONAL_ALLOWANCE;
    const basicRateAmount = Math.min(taxableSalary, adjustedBasicLimit);
    const higherRateAmount = Math.min(Math.max(0, taxableSalary - adjustedBasicLimit), HIGHER_RATE_LIMIT - basicRateLimit);
    const additionalRateAmount = Math.max(0, taxableSalary - (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE));
    
    salaryTax = (basicRateAmount * 0.20) + (higherRateAmount * 0.40) + (additionalRateAmount * 0.45);
  }
  
  // Calculate pension tax relief
  if (pensionContribution > 0) {
    if (pensionType === 'Net Pay') {
      // Tax relief = tax saved by reducing taxable income
      // Calculate what tax would have been without pension
      let taxWithoutPension = 0;
      const adjustedBasicLimit = basicRateLimit - PERSONAL_ALLOWANCE;
      const fullTaxableSalary = salary - personalAllowance;
      
      if (fullTaxableSalary > 0) {
        const basicAmount = Math.min(fullTaxableSalary, adjustedBasicLimit);
        const higherAmount = Math.min(Math.max(0, fullTaxableSalary - adjustedBasicLimit), HIGHER_RATE_LIMIT - basicRateLimit);
        const additionalAmount = Math.max(0, fullTaxableSalary - (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE));
        taxWithoutPension = (basicAmount * 0.20) + (higherAmount * 0.40) + (additionalAmount * 0.45);
      }
      
      pensionTaxRelief = taxWithoutPension - salaryTax;
    } else if (pensionType === 'Relief at Source') {
      // Basic relief (20%) already claimed, higher/additional rate relief calculated here
      const grossedUpContribution = pensionContribution / 0.8;
      const basicRelief = grossedUpContribution * 0.20;
      
      // Check if user is higher/additional rate taxpayer
      const salaryAboveBasic = Math.max(0, taxableSalary - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE));
      if (salaryAboveBasic > 0) {
        const salaryAboveHigher = Math.max(0, taxableSalary - (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE));
        if (salaryAboveHigher > 0) {
          // Additional rate taxpayer: extra 25% relief (45% - 20%)
          const additionalRelief = Math.min(grossedUpContribution, salaryAboveHigher) * 0.25;
          pensionTaxRelief = basicRelief + additionalRelief;
        } else {
          // Higher rate taxpayer: extra 20% relief (40% - 20%)
          const higherRelief = Math.min(grossedUpContribution, salaryAboveBasic) * 0.20;
          pensionTaxRelief = basicRelief + higherRelief;
        }
      } else {
        // Basic rate taxpayer: only 20% relief
        pensionTaxRelief = basicRelief;
      }
    }
  }
  
  // Calculate tax on Savings
  let savingsTax = 0;
  let savingsAfterAllowances = taxableSavings;
  
  // Apply Starting Rate for Savings (0% band)
  const startingRateUsed = Math.min(savingsAfterAllowances, startingRateForSavings);
  savingsAfterAllowances -= startingRateUsed;
  
  // Apply PSA (0% band)
  const psaUsed = Math.min(savingsAfterAllowances, psa);
  savingsAfterAllowances -= psaUsed;
  
  // Calculate savings tax based on cumulative income
  if (savingsAfterAllowances > 0) {
    const cumulativeBeforeSavings = taxableSalary;
    const adjustedBasicLimit = basicRateLimit - PERSONAL_ALLOWANCE;
    const basicRateRemaining = Math.max(0, adjustedBasicLimit - cumulativeBeforeSavings);
    const higherRateRemaining = Math.max(0, (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE) - cumulativeBeforeSavings - basicRateRemaining);
    
    const savingsAtBasic = Math.min(savingsAfterAllowances, basicRateRemaining);
    const savingsAtHigher = Math.min(Math.max(0, savingsAfterAllowances - savingsAtBasic), higherRateRemaining);
    const savingsAtAdditional = Math.max(0, savingsAfterAllowances - savingsAtBasic - savingsAtHigher);
    
    savingsTax = (savingsAtBasic * 0.20) + (savingsAtHigher * 0.40) + (savingsAtAdditional * 0.45);
  }
  
  // Calculate tax on Dividends
  let dividendTax = 0;
  let dividendsAfterAllowance = Math.max(0, taxableDividends - DIVIDEND_ALLOWANCE);
  
  if (dividendsAfterAllowance > 0) {
    const cumulativeBeforeDividends = taxableSalary + taxableSavings;
    const adjustedBasicLimit = basicRateLimit - PERSONAL_ALLOWANCE;
    const basicRateRemaining = Math.max(0, adjustedBasicLimit - cumulativeBeforeDividends);
    const higherRateRemaining = Math.max(0, (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE) - cumulativeBeforeDividends - basicRateRemaining);
    
    const dividendsAtBasic = Math.min(dividendsAfterAllowance, basicRateRemaining);
    const dividendsAtHigher = Math.min(Math.max(0, dividendsAfterAllowance - dividendsAtBasic), higherRateRemaining);
    const dividendsAtAdditional = Math.max(0, dividendsAfterAllowance - dividendsAtBasic - dividendsAtHigher);
    
    dividendTax = (dividendsAtBasic * 0.1075) + (dividendsAtHigher * 0.3575) + (dividendsAtAdditional * 0.3935);
  }
  
  const totalTax = salaryTax + savingsTax + dividendTax;
  
  return {
    totalTax,
    salaryTax,
    savingsTax,
    dividendTax,
    personalAllowance,
    taxableSalary,
    taxableSavings,
    taxableDividends,
    startingRateForSavings,
    startingRateUsed,
    psa,
    psaUsed,
    dividendAllowanceUsed: Math.min(taxableDividends, DIVIDEND_ALLOWANCE),
    pensionTaxRelief,
    adjustedSalary,
    pensionContribution,
    pensionType,
  };
};

// Calculate National Insurance
export const calculateNationalInsurance = (salary, employmentType) => {
  let ni = 0;
  
  if (employmentType === 'Employee') {
    if (salary > NI_LOWER_LIMIT) {
      const band1 = Math.min(salary - NI_LOWER_LIMIT, NI_UPPER_LIMIT - NI_LOWER_LIMIT);
      const band2 = Math.max(0, salary - NI_UPPER_LIMIT);
      ni = (band1 * 0.08) + (band2 * 0.02);
    }
  } else if (employmentType === 'Self-Employed') {
    // Class 4 NI
    if (salary > NI_LOWER_LIMIT) {
      const band1 = Math.min(salary - NI_LOWER_LIMIT, NI_UPPER_LIMIT - NI_LOWER_LIMIT);
      const band2 = Math.max(0, salary - NI_UPPER_LIMIT);
      ni = (band1 * 0.06) + (band2 * 0.02);
    }
  } else if (employmentType === 'Employer') {
    // Employer NI
    if (salary > EMPLOYER_NI_THRESHOLD) {
      ni = (salary - EMPLOYER_NI_THRESHOLD) * 0.15;
    }
  }
  
  return ni;
};

// Calculate Class 2 NI Status
export const getClass2Status = (profit) => {
  if (profit > NI_LOWER_LIMIT) {
    return {
      status: 'Class 2 Credits granted automatically',
      showToggle: false,
      cost: 0,
    };
  } else if (profit >= CLASS_2_SMALL_PROFIT_THRESHOLD && profit <= NI_LOWER_LIMIT) {
    return {
      status: 'Treated as having paid Class 2 for free',
      showToggle: false,
      cost: 0,
    };
  } else {
    return {
      status: 'No NI credit earned',
      showToggle: true,
      cost: CLASS_2_VOLUNTARY_COST,
    };
  }
};

// Main calculation function
export const calculateTaxAndNI = (salary, savings, dividends, employmentType, payVoluntaryNI = false, pensionContribution = 0, pensionType = 'Net Pay') => {
  const incomeTax = calculateIncomeTax(salary, savings, dividends, pensionContribution, pensionType);
  
  // For NI calculation, use adjusted salary for Net Pay pensions
  let salaryForNI = salary;
  if (pensionContribution > 0 && pensionType === 'Net Pay') {
    salaryForNI = salary - pensionContribution;
  }
  
  const nationalInsurance = calculateNationalInsurance(salaryForNI, employmentType);
  const class2Status = employmentType === 'Self-Employed' ? getClass2Status(salaryForNI) : null;
  
  let voluntaryNICost = 0;
  if (class2Status && class2Status.showToggle && payVoluntaryNI) {
    voluntaryNICost = class2Status.cost;
  }
  
  const totalDeductions = incomeTax.totalTax + nationalInsurance + voluntaryNICost - (incomeTax.pensionTaxRelief || 0);
  const totalIncome = salary + savings + dividends;
  const takeHome = totalIncome - totalDeductions;
  
  return {
    totalIncome,
    takeHome,
    monthlyTakeHome: takeHome / 12,
    incomeTax,
    nationalInsurance,
    class2Status,
    voluntaryNICost,
    totalDeductions,
  };
};

// Generate detailed breakdown steps
export const generateCalculationSteps = (salary, savings, dividends, employmentType, payVoluntaryNI) => {
  const result = calculateTaxAndNI(salary, savings, dividends, employmentType, payVoluntaryNI);
  const { incomeTax } = result;
  
  const steps = [];
  
  // Step 1: Total Income
  steps.push({
    title: 'Total Income',
    description: `Salary (£${salary.toLocaleString()}) + Savings Interest (£${savings.toLocaleString()}) + Dividends (£${dividends.toLocaleString()})`,
    value: `£${result.totalIncome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });
  
  // Step 2: Personal Allowance
  steps.push({
    title: 'Personal Allowance',
    description: result.totalIncome > 100000 
      ? `£12,570 reduced by £1 for every £2 over £100,000. Total reduction: £${Math.floor((result.totalIncome - 100000) / 2).toLocaleString()}`
      : 'Standard Personal Allowance for 2026/27',
    value: `£${incomeTax.personalAllowance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });
  
  // Step 3: Beneficial Ordering
  steps.push({
    title: 'Beneficial Ordering (PA Application)',
    description: 'Personal Allowance applied first to Salary, then Savings, then Dividends',
    value: `Salary: £${incomeTax.taxableSalary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} taxable | Savings: £${incomeTax.taxableSavings.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} taxable | Dividends: £${incomeTax.taxableDividends.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} taxable`,
  });
  
  // Step 4: Income Tax on Salary
  if (incomeTax.taxableSalary > 0) {
    steps.push({
      title: 'Income Tax on Salary',
      description: 'Basic Rate (20% up to £50,270), Higher Rate (40% up to £125,140), Additional Rate (45% above)',
      value: `£${incomeTax.salaryTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }
  
  // Step 5: Savings Tax
  if (savings > 0) {
    steps.push({
      title: 'Savings Tax',
      description: `Starting Rate for Savings: £${incomeTax.startingRateUsed.toLocaleString()} at 0% | PSA: £${incomeTax.psaUsed.toLocaleString()} at 0% | Remainder taxed at marginal rates`,
      value: `£${incomeTax.savingsTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }
  
  // Step 6: Dividend Tax
  if (dividends > 0) {
    steps.push({
      title: 'Dividend Tax',
      description: `Dividend Allowance: £${incomeTax.dividendAllowanceUsed.toLocaleString()} at 0% | Rates: 10.75% (Basic), 35.75% (Higher), 39.35% (Additional)`,
      value: `£${incomeTax.dividendTax.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }
  
  // Step 7: National Insurance
  steps.push({
    title: `National Insurance (${employmentType})`,
    description: employmentType === 'Employee' 
      ? '8% (£12,570-£50,270), 2% above'
      : employmentType === 'Self-Employed'
      ? 'Class 4: 6% (£12,570-£50,270), 2% above'
      : '15% on earnings above £5,000',
    value: `£${result.nationalInsurance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });
  
  // Step 8: Class 2 NI (if applicable)
  if (result.class2Status && result.voluntaryNICost > 0) {
    steps.push({
      title: 'Voluntary Class 2 NI',
      description: 'Voluntary contribution to maintain NI credits',
      value: `£${result.voluntaryNICost.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });
  }
  
  // Step 9: Total Deductions
  steps.push({
    title: 'Total Deductions',
    description: 'Income Tax + National Insurance + Voluntary NI (if applicable)',
    value: `£${result.totalDeductions.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });
  
  // Step 10: Take Home Pay
  steps.push({
    title: 'Annual Take-Home Pay',
    description: 'Total Income - Total Deductions',
    value: `£${result.takeHome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  });
  
  return steps;
};
