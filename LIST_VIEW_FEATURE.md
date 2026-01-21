# List View Feature - Implementation Summary

## Overview
Added a toggleable list view to the skills radar that provides a printable, scrollable version of all skills with their full descriptions.

## Features Implemented

### 1. Toggle Button
- Fixed position button in the top-right corner
- Shows "📄 List View" when in radar view
- Shows "🎯 Radar View" when in list view
- Appears after the radar loads

### 2. Multiple View Modes
Choose how you want to view the skills:

#### **View by Quadrants** (Default)
- Organized by: Quadrant → Level → Skills
- Groups skills by their domain area
- Within each quadrant, skills are ordered by level (Working → Practitioner → Expert)
- Best for understanding skills within each domain

#### **View by Number**
- All 107 skills listed in numerical order (#1 → #107)
- Shows the complete learning progression
- Each skill displays its quadrant and level
- Best for following the recommended learning path

#### **View by Level**
- Organized by: Level → Skills
- Three sections: Working, Practitioner, Expert
- Skills from all quadrants grouped by difficulty
- Best for focusing on skills at your current level

### 3. List View Display
- **Sticky Headings**: Context always visible while scrolling
  - Quadrant titles stick to the top of the viewport
  - Ring/Level titles stick below quadrant title
  - Always see which category and level you're viewing
  - Smooth layering as new headings replace previous ones
- **Accordion Interface**: Each skill is collapsed by default
  - Click any skill header to expand and view full description
  - Click again to collapse
  - Arrow indicator shows expand/collapse state
- **Expand/Collapse All Button**: Located in the view selector bar
  - Click "Expand All" to open all skills at once
  - Click "Collapse All" to close all skills
  - Styled with subtle gray border to distinguish from view filters
- Each skill shows:
  - Skill number (#1, #2, etc.)
  - Skill name
  - Full description with formatted content (when expanded)
  - All bullet points and links

### 4. Print-Friendly Styling
- Optimized layout for printing
- Page breaks avoid splitting skills
- Clean black and white formatting
- Removes navigation elements when printing

### 5. Responsive Design
- Works on desktop and mobile
- Maintains readable typography
- Proper spacing for easy scanning

## Files Created

### JavaScript
- `/src/util/listView.js` - Core list view logic
  - `createListView()` - Generates HTML list from radar data
  - `initializeToggle()` - Sets up toggle button and view switching

### Styles
- `/src/stylesheets/_listview.scss` - Complete styling for list view
  - Button styles
  - List layout
  - Print media queries
  - View switching classes

## Files Modified

### `/src/stylesheets/base.scss`
- Added `@import 'listview'` to include new stylesheet

### `/src/graphing/radar.js`
- Imported `initializeToggle` from listView utility
- Called `initializeToggle(radar)` at end of plot function

## How It Works

1. **Radar loads normally** - Shows interactive circular visualization
2. **Toggle appears** - Fixed button in top-right corner
3. **Click "List View"**:
   - Body gets `list-view-active` class
   - Radar and tables hidden
   - List view container shown
   - Skills rendered in order by quadrant/ring
4. **Click "Radar View"**:
   - Returns to interactive radar
   - List view hidden

## Quadrant & Ring Order

### Quadrants (clockwise):
1. Setup and Deployment
2. Pages and Layouts
3. Components and Patterns
4. Data and Logic

### Levels (inner → outer rings):
1. Working (Foundation skills)
2. Practitioner (Intermediate skills)
3. Expert (Advanced skills)

## Print Behavior

When printing (Cmd+P / Ctrl+P):
- Automatically shows list view
- Hides navigation and buttons
- Optimizes for paper format
- Adds borders to skills for clarity

## Testing

To test the feature:
1. Navigate to http://localhost:8080/
2. Wait for radar to load
3. Click the "📄 List View" button in top-right
4. Try the different view modes:
   - **Quadrants** - Organized by domain area
   - **By Number** - Skills in learning order (#1-107)
   - **By Level** - Grouped by Working/Practitioner/Expert
5. **Test Sticky Headings**:
   - Scroll down and watch quadrant title stick to top
   - Notice ring/level title sticks below quadrant title
   - Continue scrolling to see new headings replace old ones
   - Context always visible (category + level)
6. **Test Accordions**:
   - Click any skill to expand and view description
   - Click again to collapse
   - Use "Expand All" button to open all skills
   - Use "Collapse All" button to close all skills
7. Scroll through skills
8. Test print preview (Cmd+P) - all skills auto-expand, headings become static
9. Toggle back to "🎯 Radar View"

## Benefits

✅ **Sticky Headings** - Always see which category and level you're viewing
✅ **Printable** - Easy to print complete skill reference (auto-expands all)
✅ **Searchable** - Browser Cmd+F works across all skills
✅ **Scrollable** - No clicking through individual skills
✅ **Accordion Interface** - Collapsed by default, expand only what you need
✅ **Expand/Collapse All** - Quickly open or close all skills
✅ **Multiple Views** - Choose how to organize: by domain, number, or level
✅ **Flexible Learning** - View skills in the way that suits your needs
✅ **Accessible** - Keyboard navigable, ARIA attributes, screen reader friendly
✅ **Toggle** - Switch between views without losing context
✅ **Print-optimized** - Automatic formatting for paper

## Future Enhancements (Optional)

- Export to PDF button
- Filter by quadrant or ring
- Search/filter within list view
- Bookmark/anchor links to specific skills
- Collapsible quadrants for easier navigation
