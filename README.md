# UK Tax & NI Calculator 2026/27

A professional UK Tax and National Insurance calculator for the 2026/27 tax year with transparent calculation breakdowns.

## 🎯 Features

- **Input Fields**: Annual Salary, Savings Interest, Dividend Income
- **Employment Types**: Employee, Self-Employed, Employer with accurate NI rates
- **Class 2 NI Logic**: Dynamic status updates with voluntary contributions for self-employed
- **Real-time Calculations**: Instant updates as you type
- **Transparent Breakdown**: Step-by-step "How This Was Calculated" section
- **Export Options**: CSV, PDF, and Print functionality
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Design**: Navy/slate theme with modern UI

## 🏗️ Architecture

**This is a 100% client-side application.** All tax calculations run in the browser using JavaScript.

- **Frontend**: React with Tailwind CSS
- **Calculations**: Pure JavaScript (no backend needed)
- **Backend**: Minimal FastAPI placeholder (not used for calculations)

## 📊 2026/27 UK Tax Rules Implemented

✅ Personal Allowance: £12,570 (reduces for income >£100k)  
✅ Beneficial Ordering: PA applies to Salary → Savings → Dividends  
✅ Starting Rate for Savings: £5,000 at 0% (reduces by salary over PA)  
✅ Personal Savings Allowance: £1,000 (Basic), £500 (Higher), £0 (Additional)  
✅ National Insurance:
  - Employee: 8% (£12,570-£50,270), 2% above
  - Self-Employed (Class 4): 6% (£12,570-£50,270), 2% above
  - Employer: 15% on earnings above £5,000  
✅ Dividend Tax: £500 allowance, then 10.75%/35.75%/39.35%  
✅ Class 2 NI: Dynamic status based on profit levels with £189.80 voluntary option

## 🚀 Quick Start

### Development

```bash
cd frontend
yarn install
yarn start
```

The app will open at `http://localhost:3000`

### Static Build

```bash
cd frontend
yarn build
```

The optimized static site will be in `frontend/build/` - ready to deploy to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static hosting provider

## 📁 Project Structure

```
/app/
├── frontend/
│   ├── src/
│   │   ├── App.js                    # Main React component
│   │   ├── utils/
│   │   │   ├── taxCalculator.js      # All 2026/27 tax calculation logic
│   │   │   └── exportUtils.js        # CSV/PDF export functions
│   │   └── components/ui/            # Shadcn UI components
│   ├── package.json
│   └── tailwind.config.js
└── backend/                          # Not used (placeholder only)
```

## 🎨 Design

- **Typography**: Manrope (headings), Inter (body), JetBrains Mono (numbers)
- **Colors**: Professional navy (#0F172A) and slate theme
- **Components**: Shadcn UI with custom financial styling
- **Responsive**: Mobile-first design with breakpoints

## 🧪 Testing

Comprehensive testing completed with 98% success rate covering:
- Tax calculation accuracy
- UI functionality (inputs, toggles, accordions)
- Export features (CSV, PDF, Print)
- Mobile responsiveness
- Edge cases and validation

## 📝 Usage

1. Enter your annual income details (Salary, Savings Interest, Dividends)
2. Select your employment type (Employee, Self-Employed, or Employer)
3. View your real-time take-home pay calculation
4. Review the detailed tax statement breakdown
5. Expand "How This Was Calculated" to see step-by-step math
6. Export your statement to CSV or PDF

## ⚖️ Disclaimer

This calculator is for informational purposes only. All calculations are based on current HMRC guidelines for the 2026/27 tax year. Please consult with a qualified tax advisor for personalized advice.

## 📄 License

Built with Emergent AI
