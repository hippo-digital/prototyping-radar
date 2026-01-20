# Heroku H10 Error Fix

## Problem
The app crashes on Heroku with H10 error because the `dist` directory is not created during build.

## Root Cause
Webpack and build tools are in `devDependencies`, but Heroku doesn't install devDependencies by default in production mode.

## Solution

### Option 1: Configure Heroku to Install DevDependencies (RECOMMENDED)

Run this command to allow Heroku to install devDependencies:

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false
```

This tells NPM to install both `dependencies` and `devDependencies`, which are needed for the webpack build.

Then redeploy:
```bash
git push heroku main
```

### Option 2: Move Build Tools to Dependencies

Alternatively, move webpack and build tools from `devDependencies` to `dependencies` in `package.json`.

However, this is not recommended as it increases the slug size unnecessarily.

## Verification

After deploying, check the logs to verify the build succeeded:

```bash
heroku logs --tail --source app
```

You should see:
```
-----> Running heroku-postbuild
Wrote 87 items to /tmp/build.../data/prototyping-data.json
webpack 5.89.0 compiled successfully
```

Then check if the app is running:
```bash
heroku ps
```

You should see:
```
web.1: up YYYY/MM/DD HH:MM:SS
```

## Quick Fix Commands

```bash
# 1. Set NPM config
heroku config:set NPM_CONFIG_PRODUCTION=false

# 2. Verify config
heroku config

# 3. Trigger redeploy (if needed)
git commit --allow-empty -m "Trigger rebuild"
git push heroku main

# 4. Check logs
heroku logs --tail

# 5. Open app
heroku open
```

## Why This Works

- `NPM_CONFIG_PRODUCTION=false` tells NPM to install all dependencies, including devDependencies
- The `heroku-postbuild` script then has access to webpack and can build the dist directory
- The server.js can then serve the built files from dist/

## Alternative: Using Webpack in Dependencies

If you prefer not to use NPM_CONFIG_PRODUCTION=false, you can move just the essential build tools to dependencies:

```json
"dependencies": {
  "webpack": "^5.89.0",
  "webpack-cli": "^5.1.4",
  "html-webpack-plugin": "^5.5.3",
  "mini-css-extract-plugin": "^2.7.6",
  // ... other build tools needed for heroku-postbuild
}
```

But this is more maintenance overhead.
