# Deployment Instructions

This project consists of a React frontend and Flask backend for 3D Protein Structure Prediction.

## Prerequisites
- GitHub account (already set up ✓)
- Netlify account (free tier: https://app.netlify.com/signup)
- Render account (free tier: https://dashboard.render.com/register)

## Backend Deployment (Render)

### Step 1: Deploy to Render
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your repository: `MonishaZzzz/Protein3DStructurePrediction`
5. Configure the service:
   - **Name**: `protein-prediction-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank (we'll use render.yaml)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --config gunicorn_config.py`
6. Click "Create Web Service"
7. Wait for deployment (usually takes 5-10 minutes)
8. Once deployed, copy your backend URL (e.g., `https://protein-prediction-backend.onrender.com`)

### Note about Free Tier
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds

## Frontend Deployment (Netlify)

### Step 1: Update Backend URL
1. Open `frontend/src/config/api.ts`
2. Replace `https://your-backend-app.onrender.com` with your actual Render backend URL:
   ```typescript
   export const API_BASE_URL = 'https://protein-prediction-backend.onrender.com';
   ```
3. Commit and push this change:
   ```bash
   git add frontend/src/config/api.ts
   git commit -m "Update backend URL for production"
   git push origin main
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify CLI (Recommended)
1. Install Netlify CLI (if not installed):
   ```bash
   npm install -g netlify-cli
   ```
2. From the frontend directory:
   ```bash
   cd frontend
   netlify deploy --dir=dist
   ```
3. Follow the prompts to link to a new site
4. For production deployment:
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Option B: Deploy via Netlify Dashboard
1. Go to https://app.netlify.com/
2. Drag and drop the `frontend/dist` folder to the deployment area
3. Or click "Add new site" → "Import an existing project"
4. Connect to GitHub and select `MonishaZzzz/Protein3DStructurePrediction`
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click "Deploy site"

#### Option C: Deploy via GitHub Integration
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize
4. Choose repository: `MonishaZzzz/Protein3DStructurePrediction`
5. Build settings will be auto-detected from `netlify.toml`
6. Click "Deploy site"

### Step 3: Get Your Site URL
After deployment, Netlify will provide you with a URL like:
- `https://amazing-protein-predictor.netlify.app`

You can customize this domain in Site Settings → Domain Management.

## Testing the Deployment

1. Visit your Netlify frontend URL
2. Enter a protein sequence (example: `MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH`)
3. Submit the sequence
4. The frontend will communicate with your Render backend
5. Wait for the prediction results

## Important Notes

### Backend Limitations
The current backend uses:
- ESM Atlas API for structure prediction (external dependency)
- In-memory job storage (jobs are lost on restart)
- Note: Some ML model files referenced in code may need to be added if using local prediction

### Production Improvements Needed
1. Add a database for persistent job storage
2. Implement proper authentication if needed
3. Add rate limiting
4. Configure CORS to only allow your Netlify domain
5. Add error monitoring (e.g., Sentry)
6. Consider upgrading to paid tiers for better performance

## Troubleshooting

### Backend Issues
- If backend returns CORS errors, check Flask-CORS configuration
- If predictions fail, verify ESM Atlas API is accessible
- Check Render logs: Dashboard → Your Service → Logs

### Frontend Issues
- If API calls fail, verify the backend URL in `frontend/src/config/api.ts`
- Check browser console for errors
- Verify Netlify build logs

## Local Development

To run locally:

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Update `frontend/src/config/api.ts` to use local backend:
```typescript
export const API_BASE_URL = 'http://localhost:5000';
```

## Repository Structure
```
FYP/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── gunicorn_config.py  # Production server config
├── frontend/
│   ├── src/
│   │   └── config/
│   │       └── api.ts      # API configuration (UPDATE THIS!)
│   ├── dist/               # Built frontend (created after npm run build)
│   ├── netlify.toml        # Netlify configuration
│   └── package.json        # Node dependencies
└── render.yaml             # Render configuration
```

## Support
For issues or questions:
1. Check the logs on Render/Netlify dashboards
2. Review the error messages in browser console
3. Ensure all configuration files are properly committed to GitHub