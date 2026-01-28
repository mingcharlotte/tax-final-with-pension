# Static Deployment Guide

Since this is a **pure frontend application**, you can deploy only the `/app/frontend` directory to any static hosting provider.

## Option 1: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to `main` branch, `/frontend/build` folder
4. Run `yarn build` in the frontend directory
5. Your site will be live at `https://yourusername.github.io/my-tax-app-2627`

## Option 2: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build your app:
   ```bash
   cd frontend
   yarn build
   ```
3. Deploy:
   ```bash
   netlify deploy --prod --dir=build
   ```

Or use Netlify's GitHub integration for automatic deployments.

**Build settings:**
- Base directory: `frontend`
- Build command: `yarn build`
- Publish directory: `frontend/build`

## Option 3: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. From the frontend directory:
   ```bash
   cd frontend
   vercel
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

**Build settings:**
- Framework Preset: Create React App
- Root Directory: `frontend`
- Build Command: `yarn build`
- Output Directory: `build`

## Option 4: AWS S3 + CloudFront

1. Build your app:
   ```bash
   cd frontend
   yarn build
   ```

2. Create an S3 bucket and enable static website hosting

3. Upload the contents of `build/` to your S3 bucket

4. Set up CloudFront distribution for HTTPS and CDN

## Option 5: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```
3. Build your app:
   ```bash
   cd frontend
   yarn build
   ```
4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

## Environment Variables

Since this is a static site with no API calls, no environment variables are needed for deployment.

The `REACT_APP_BACKEND_URL` in `.env` is unused and can be removed or ignored.

## Build Output

After running `yarn build`, you'll get:
- Optimized production build
- Minified JavaScript and CSS
- Static HTML files
- All assets properly hashed for caching

The entire application (including all calculations) is contained in these static files.
