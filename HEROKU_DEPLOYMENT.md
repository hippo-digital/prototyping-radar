# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli
- Git repository initialized
- Heroku account created

## Files Created
✅ `server.js` - Express server to serve production build
✅ `Procfile` - Tells Heroku how to start the app
✅ `package.json` - Updated with start script, heroku-postbuild, and engines

## Environment Variables
The app uses the following environment variables that need to be set on Heroku:

```bash
QUADRANTS=["Run and maintain","Pages and journeys","Data and Logic","Components and patterns"]
RINGS=["Working","Practitioner","Expert"]
```

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a new Heroku app
```bash
heroku create your-radar-app-name
```
Replace `your-radar-app-name` with your desired app name.

### 3. Set environment variables
```bash
heroku config:set QUADRANTS='["Run and maintain","Pages and journeys","Data and Logic","Components and patterns"]'
heroku config:set RINGS='["Working","Practitioner","Expert"]'
heroku config:set NODE_ENV=production
```

### 4. Commit your changes
```bash
git add .
git commit -m "Add Heroku deployment configuration"
```

### 5. Deploy to Heroku
```bash
git push heroku main
```
Or if you're on a different branch:
```bash
git push heroku your-branch-name:main
```

### 6. Open your app
```bash
heroku open
```

## What Happens During Deployment

1. Heroku detects this is a Node.js app
2. Installs dependencies (`npm install`)
3. Runs `heroku-postbuild` script which:
   - Builds the data from markdown files (`npm run build:data:md`)
   - Creates production webpack bundle (`npm run build:prod`)
4. Starts the app using `npm start` which runs `node server.js`

## Viewing Logs
```bash
heroku logs --tail
```

## Troubleshooting

### Build fails
Check the build logs:
```bash
heroku logs --tail
```

### App crashes
Check if the PORT is being used correctly:
```bash
heroku config
```

### Environment variables not working
Verify they're set:
```bash
heroku config
```

## Local Production Testing
Test the production build locally before deploying:
```bash
npm run build:data:md
npm run build:prod
npm start
```
Then visit http://localhost:8083

## Updating the App
After making changes:
```bash
git add .
git commit -m "Your commit message"
git push heroku main
```

## Custom Domain (Optional)
To use a custom domain:
```bash
heroku domains:add www.yourdomain.com
```
Then configure your DNS as per Heroku's instructions.
