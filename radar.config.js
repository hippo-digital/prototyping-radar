// Configuration for the Build Your Own Radar
// This file replaces environment variables for easier management

module.exports = {
  quadrants: [
    "Run and maintain",
    "Pages and journeys",
    "Data and Logic",
    "Components and patterns"
  ],

  rings: [
    "Working",
    "Practitioner",
    "Expert"
  ],

  // Optional: Other configuration settings
  enableGoogleAuth: false,

  // Default sheet URL - points to the prototyping skills data
  defaultSheetUrl: '/data/prototyping-data.json',

  // Google Analytics/Tag Manager ID (if needed)
  gtmId: null,

  // Adobe Launch Script URL (if needed)
  adobeLaunchScriptUrl: null
};
