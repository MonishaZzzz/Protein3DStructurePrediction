# Manual Deployment to Render (Alternative Method)

If your repository isn't showing in Render's GitHub integration, use this manual method:

## Option 1: Using Public Git URL

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Instead of connecting GitHub, choose **"Public Git repository"**
4. Enter your repository URL: 
   ```
   https://github.com/MonishaZzzz/Protein3DStructurePrediction
   ```
5. Configure the service:
   - **Name**: `protein-prediction-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --config gunicorn_config.py`
6. Click "Create Web Service"

## Option 2: Fix GitHub Integration

1. **Disconnect and Reconnect GitHub:**
   - Go to Render [Account Settings](https://dashboard.render.com/settings)
   - Click "GitHub" 
   - Click "Disconnect GitHub"
   - Then reconnect by clicking "Connect GitHub"
   - Make sure to grant access to your repositories

2. **Check Repository Visibility:**
   - Make sure your repository is public
   - Go to https://github.com/MonishaZzzz/Protein3DStructurePrediction/settings
   - Scroll to "Danger Zone"
   - Make sure it says "Public" (if private, Render free tier won't see it)

3. **Direct Authorization Link:**
   - Try this direct link to authorize Render: 
   - https://github.com/apps/render/installations/new
   - Select your account
   - Grant access to "All repositories" or specifically select "Protein3DStructurePrediction"

## Option 3: Using Render Blueprint (Automatic)

Since we have a `render.yaml` file, you can use Render's Blueprint feature:

1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Enter your repository URL: `https://github.com/MonishaZzzz/Protein3DStructurePrediction`
4. Render will automatically detect the `render.yaml` and configure everything

## Quick Deploy Button

You can also try this direct deploy link:
```
https://render.com/deploy?repo=https://github.com/MonishaZzzz/Protein3DStructurePrediction
```

## After Deployment

Once deployed, you'll get a URL like:
- `https://protein-prediction-backend-xxxx.onrender.com`

Remember to update your frontend configuration with this URL!