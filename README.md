# UK Tax & NI Calculator 2026/27

A professional UK Tax and National Insurance calculator for the 2026/27 tax year with transparent calculation breakdowns. **100% client-side React application** - no backend needed!

## 🎯 Features

- **Input Fields**: Annual Salary, Savings Interest, Dividend Income
- **Employment Types**: Employee, Self-Employed, Employer with accurate NI rates
- **Class 2 NI Logic**: Dynamic status updates with voluntary contributions
- **Real-time Calculations**: Instant updates as you type
- **Transparent Breakdown**: Step-by-step "How This Was Calculated" section
- **Export Options**: CSV, PDF, and Print functionality
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Design**: Navy/slate theme with modern UI

## 🏗️ Tech Stack

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful component library
- **jsPDF** - PDF export functionality
- **Pure JavaScript** - All calculations run client-side

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
yarn dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
cd frontend
yarn build
```

The optimized static site will be in `frontend/dist/`

### Preview Production Build

```bash
cd frontend
yarn preview
```

## 📁 Project Structure

```
/app/
└── frontend/
    ├── src/
    │   ├── App.js                    # Main React component
    │   ├── utils/
    │   │   ├── taxCalculator.js      # All 2026/27 tax calculation logic
    │   │   └── exportUtils.js        # CSV/PDF export functions
    │   └── components/ui/            # Shadcn UI components
    ├── package.json                  # Clean Vite dependencies
    ├── vite.config.js                # Vite configuration
    ├── tailwind.config.js            # Tailwind configuration
    └── index.html                    # Entry HTML
```

## 🚀 Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "UK Tax Calculator"
   git remote add origin https://github.com/yourusername/my-tax-app-2627.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - Click "Deploy"
   - Done! Your app is live

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 🌐 Deploy Anywhere

This is a static site - deploy to:
- ✅ **Vercel** (recommended - auto-detects Vite)
- ✅ **Netlify** (build: `yarn build`, dir: `frontend/dist`)
- ✅ **GitHub Pages**
- ✅ **AWS S3 + CloudFront**
- ✅ **Firebase Hosting**
- ✅ **Cloudflare Pages**

## 🎨 Design

- **Typography**: Manrope (headings), Inter (body), JetBrains Mono (numbers)
- **Colors**: Professional navy (#0F172A) and slate theme
- **Components**: Shadcn UI with custom financial styling
- **Responsive**: Mobile-first design

## 📝 Usage

1. Enter your annual income (Salary, Savings, Dividends)
2. Select employment type
3. View real-time take-home pay
4. Review detailed tax breakdown
5. Expand "How This Was Calculated" for step-by-step math
6. Export to CSV or PDF

## ⚖️ Disclaimer

For informational purposes only. Based on 2026/27 HMRC guidelines. Consult a qualified tax advisor for personalized advice.

## 📄 License

Built with Emergent AI
