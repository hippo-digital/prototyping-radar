# Self-Assessment Feature

## Overview
The self-assessment feature allows users to rate their proficiency in each skill on the radar and receive personalized recommendations.

## Features Implemented

### 1. Two-Column Layout (50/50 Split)
- **Left Column**: Skills list with inline rating buttons (scrolls together)
  - **Sticky quadrant headers**: Main category always visible at top (z-index: 20)
  - **Sticky ring/level headers**: Sub-category below quadrant (z-index: 10)
  - Shows radar skill numbers (maintains radar order)
  - Skill name and quadrant indicator
  - Four rating buttons inline (⚪🌱📚⭐)
  - Checkmark when rated
  - **This is the only place to rate skills**
- **Right Column**: Description panel (read-only, sticky)
  - Shows selected skill details
  - Full description with formatting
  - No rating inputs - descriptions only

### 2. Rating System
Four proficiency levels:
- **0 - Not Started** ⚪: No experience yet
- **1 - Learning** 🌱: Basic awareness, exploring
- **2 - Developing** 📚: Can use with guidance
- **3 - Proficient** ⭐: Confident independent use

### 3. User Experience
- Skills numbered in radar order (e.g., #1, #2, #3...)
- **Sticky context headers**: Always see which quadrant and level you're viewing
  - Quadrant header (e.g., "Setup and Deployment") sticks at top
  - Level header (e.g., "Working") sticks below quadrant
  - Headers replace each other as you scroll through sections
- Skills and ratings scroll together in left column
- Click any skill to view description in right panel
- **Rate skills using inline emoji buttons only** (⚪🌱📚⭐)
  - All rating happens in the left column
  - Right panel is description-only for easier reading
- Auto-save progress to localStorage
- Visual checkmark (✓) when skill is rated
- Progress bar shows completion
- Selected skill highlights in blue

### 4. Summary View
After completing assessment:
- Stats breakdown (Proficient/Developing/Learning/Not Started)
- Placeholder for AI recommendations (Gemini integration ready)
- Export results as JSON

## How to Use

1. **Start Assessment**: Click "📋 Self-Assessment" button in header
2. **Rate Skills**: Click through skills and rate your level
3. **Save Progress**: Auto-saves as you go
4. **Complete**: Click "✅ Complete Assessment" when done
5. **View Summary**: See stats and recommendations
6. **Export**: Download your assessment as JSON

## Data Storage

### localStorage
- Key: `hippo-skills-assessment`
- Format:
```json
{
  "Skill Name": {
    "rating": 2,
    "ring": "Practitioner",
    "quadrant": "Pages and Layouts",
    "timestamp": "2026-01-22T10:30:00.000Z"
  }
}
```

## Files Created

- `/src/util/assessmentFlow.js` - Main assessment logic
- `/src/stylesheets/_assessment.scss` - Assessment modal styles

## Files Modified

- `/src/stylesheets/base.scss` - Added assessment import
- `/src/graphing/radar.js` - Added assessment button and exposed radar globally
- `/src/util/listView.js` - Updated toggle to be added to header instead of fixed position
- `/src/stylesheets/_listview.scss` - Removed fixed positioning styles for toggle
- `/src/stylesheets/_header.scss` - Added flex layout for header with buttons
- `/src/stylesheets/_search.scss` - Made search container more compact (max 400px)

## Next Steps (AI Integration)

To add Gemini AI recommendations:

1. Create `/src/util/aiRecommendations.js`
2. Add Gemini API key to environment
3. Replace placeholder in `generateAIRecommendations()` function
4. Build prompt from assessment data
5. Parse and display AI response

See implementation plan in previous documentation.

## Button Locations

Both control buttons are now located in the header for easy access:

- **Header Layout**: Logo on left, controls group on right
- **Controls Group** (right-aligned):
  - "📄 List View" / "🎯 Radar View" toggle button
  - "📋 Self-Assessment" button  
  - Search field
- **Button Styling**: Matches search field appearance
  - Same height (48px)
  - Same rounded corners (10px border-radius)
  - Same background color (#edf1f3)
  - Hover effects for interactivity
- All controls fit comfortably in the header on desktop

## Responsive Design

- Desktop: Equal 50/50 split between skills and description
- Tablet: Maintains 50/50 split
- Mobile: Single column, skills list limited height

## Key Improvements

1. **Radar Numbering**: Skills maintain their radar numbers (not sequential 1-107)
2. **Unified Scrolling**: Ratings scroll with skills in same pane
3. **Sticky Context Headers**: Always see which quadrant and level you're in
4. **50/50 Layout**: Equal space for skills and descriptions
5. **Single Rating Location**: All rating happens in left column only - cleaner, less confusing
6. **Faster Rating**: Inline buttons make it quicker to assess multiple skills

## Accessibility

- Keyboard navigable
- ARIA labels on buttons
- Focus indicators
- Semantic HTML structure
