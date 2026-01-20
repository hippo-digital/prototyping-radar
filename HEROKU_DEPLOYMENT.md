# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli
- Git repository initialized
- Heroku account created

## Files Created
✅ `server.js` - Express server to serve production build
✅ `Procfile` - Tells Heroku how to start the app
✅ `radar.config.js` - Configuration file for quadrants, rings, and other settings
✅ `package.json` - Updated with start script, heroku-postbuild, and engines

## Configuration
All radar configuration is now in `radar.config.js` which is included in your codebase:
- **Quadrants**: Run and maintain, Pages and journeys, Data and Logic, Components and patterns
- **Rings**: Working, Practitioner, Expert

To modify the configuration, simply edit `radar.config.js` and commit the changes.

## Environment Variables
You no longer need to set QUADRANTS and RINGS as environment variables!

Optional environment variables (only if needed):
```bash
heroku config:set CLIENT_ID=your-client-id
heroku config:set API_KEY=your-api-key
heroku config:set GTM_ID=your-gtm-id
```

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a new Heroku app
```bash
heroku create prototyping-skills-tree
```

### 3. Configure NPM to install build dependencies
```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
```
⚠️ **This is REQUIRED** - Webpack and build tools are in devDependencies, which Heroku needs to build the dist directory.

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

### 5. Open your app
```bash
heroku open
```

## What Happens During Deployment

1. Heroku detects this is a Node.js app
2. Installs dependencies (`npm install` - including devDependencies because of NPM_CONFIG_PRODUCTION=false)
3. Runs `heroku-postbuild` script which:
   - Builds the data from markdown files (`npm run build:data:md`) → creates `/data/prototyping-data.json`
   - Creates production webpack bundle (`npm run build:prod`) → creates `/dist` directory
4. Starts the app using `npm start` which runs `node server.js`
5. Server serves:
   - Static files from `/dist`
   - Data files from `/data`
   - Auto-loads `/data/prototyping-data.json` (configured in `radar.config.js`)

## Viewing Logs
```bash
heroku logs --tail
```

## Troubleshooting

### H10 Error: App Crashed
If you see `H10 desc="App crashed"` error:

1. **Check build logs:**
   ```bash
   heroku logs --tail --source app
   ```

2. **Verify the build completed:**
   The `heroku-postbuild` script should run during deployment and create the `dist` directory.
   Look for these lines in the logs:
   ```
   -----> Running heroku-postbuild
   Wrote 87 items to /tmp/build.../data/prototyping-data.json
   webpack 5.89.0 compiled successfully
   ```

3. **Common causes:**
   - Build failed silently - check for webpack errors in logs
   - Missing dependencies - ensure all dependencies are in `dependencies` not `devDependencies`
   - Node version mismatch - verify `engines` in package.json matches Heroku

4. **Force a rebuild:**
   ```bash
   heroku repo:purge_cache -a your-app-name
   git commit --allow-empty -m "Rebuild"
   git push heroku main
   ```

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
