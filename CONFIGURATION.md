# Radar Configuration Guide

## Overview
The radar configuration has been moved from environment variables to a dedicated config file (`radar.config.js`) for easier management and deployment.

## Configuration File: `radar.config.js`

This file contains all radar-specific settings:

```javascript
module.exports = {
  quadrants: [
    "Run and maintain",
    "Pages and journeys",
    "Components and patterns",
    "Data and Logic",
  ],
  
  rings: [
    "Working",
    "Practitioner",
    "Expert"
  ],
  
  // Default sheet URL - automatically loads this JSON file
  defaultSheetUrl: '/data/prototyping-data.json',
  
  // Optional settings
  enableGoogleAuth: false,
  defaultSheetUrl: null,
  gtmId: null,
  adobeLaunchScriptUrl: null
};
```

## Modifying Configuration

### To Change Quadrants
Edit the `quadrants` array in `radar.config.js`:

```javascript
quadrants: [
  "Your First Quadrant",
  "Your Second Quadrant",
  "Your Third Quadrant",
  "Your Fourth Quadrant"
]
```

**Important:** You must have exactly 4 quadrants.

### To Change Rings
Edit the `rings` array in `radar.config.js`:

```javascript
rings: [
  "Your First Ring",
  "Your Second Ring",
  "Your Third Ring"
]
```

**Note:** You can have 1-4 rings. The innermost ring should be first in the array.

### Current Configuration
- **Quadrants:** Run and maintain, Pages and journeys, Data and Logic, Components and patterns
- **Rings:** Working (innermost), Practitioner (middle), Expert (outermost)
- **Ring Sizes:** Working (60%), Practitioner (25%), Expert (15%)

## Benefits of Config File Approach

✅ **Version Controlled** - Configuration is part of your codebase
✅ **Easier to Manage** - No need to set environment variables
✅ **Consistent Across Environments** - Same config in development and production
✅ **Simpler Deployment** - No environment variable setup needed on Heroku
✅ **Team Friendly** - Everyone uses the same configuration

## Environment Variables (.env)

The `.env` file is now optional and only used for sensitive data like API keys:

```
# Optional environment variables
CLIENT_ID=your-google-client-id
API_KEY=your-api-key
GTM_ID=your-google-tag-manager-id
```

**Note:** The `.env` file is gitignored and should not be committed to version control.

## Development Workflow

1. Edit `radar.config.js` to change quadrants/rings
2. Restart the dev server: `npm run dev`
3. Commit changes: `git add radar.config.js && git commit -m "Update radar config"`
4. Deploy: `git push` (or `git push heroku main` for Heroku)

## Production Deployment

No additional steps needed! The `radar.config.js` file is automatically included in your deployment.

### Heroku
```bash
git push heroku main
```

The configuration is built into the application bundle, no environment variables needed.

## Troubleshooting

### Configuration not updating
1. Ensure you saved `radar.config.js`
2. Restart the dev server: `pkill -f webpack-dev-server && npm run dev`
3. Hard refresh your browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Wrong quadrants/rings showing
- Check `radar.config.js` is in the project root
- Verify the module.exports syntax is correct
- Check browser console for any JavaScript errors

## Migration from Environment Variables

If you're migrating from the old environment variable approach:

**Before** (.env):
```
QUADRANTS=["Run and maintain","Pages and journeys","Components and patterns","Data and Logic"]
RINGS=["Working","Practitioner","Expert"]
```

**After** (radar.config.js):
```javascript
module.exports = {
  quadrants: ["Run and maintain","Pages and journeys","Components and patterns","Data and Logic"],
  rings: ["Working","Practitioner","Expert"]
};
```

Simply move the values from `.env` to `radar.config.js` and delete the old environment variables.
