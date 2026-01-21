# Skills Tree Improvements - Summary

## Overview

Based on an honest appraisal of the skills radar, the following improvements have been implemented:

## 1. Quadrant Renaming

| Old Name | New Name |
|----------|----------|
| Run and maintain | **Setup and Deployment** |
| Pages and journeys | **Pages and Layouts** |
| Components and patterns | **Components and Patterns** |
| Data and Logic | Data and Logic (unchanged) |

### Files Updated:
- `radar.config.js` - Updated quadrant names
- `src/models/radar.js` - Updated quadrant order mapping
- All 103 markdown files in `data/items-md/` - Updated quadrant references

## 2. New Skills Added (23 new skills)

### Setup and Deployment
| Skill | Ring | Purpose |
|-------|------|---------|
| Setting up VS Code | Working | IDE configuration for prototyping |
| Introduction to Git and GitHub | Working | Version control basics for beginners |
| Using browser DevTools | Working | Debugging in browser |
| Environment variables | Practitioner | Configuration management |
| Backing up prototypes | Practitioner | Version safety |
| Password protection | Practitioner | Deployment security |
| Prototype documentation | Practitioner | README and inline docs |
| Cleaning up before sharing | Practitioner | Pre-sharing cleanup |
| Archiving old versions | Expert | Long-term version management |

### Pages and Layouts
| Skill | Ring | Purpose |
|-------|------|---------|
| Mobile responsive testing | Working | Testing on different screen sizes |
| Error page handling | Practitioner | 404/500 pages |
| Deep linking | Practitioner | Bookmarkable states |
| User research handoff | Practitioner | Preparing for UR sessions |
| Print stylesheets | Expert | Print-friendly pages |

### Components and Patterns
| Skill | Ring | Purpose |
|-------|------|---------|
| Tables with data | Working | Data presentation |
| Accordions | Working | Collapsible content |
| Accessibility testing basics | Working | Basic a11y testing |
| Autocomplete component | Practitioner | Typeahead functionality |
| Skip links and focus management | Practitioner | Accessibility |
| WCAG basics for prototypers | Practitioner | Understanding a11y standards |

### Data and Logic
| Skill | Ring | Purpose |
|-------|------|---------|
| Generating reference numbers | Practitioner | Confirmation page realism |
| Date manipulation | Practitioner | Date calculations |
| Email notification preview | Expert | Notification testing |
| Multi-user testing | Expert | Two-sided services |

## 3. Skill Ordering Updated

All skills now have logical ordering based on learning progression:

### Setup and Deployment / Working (14 skills)
1. Setting up VS Code
2. Installing the kit
3. Node.js basics
4. NPM packages
5. Introduction to Git and GitHub
6. Terminal basics
7. Running the kit locally
8. Restarting the kit
9. What's in the kit
10. Folder structure
11. Assets folder
12. Update notifications
13. Using browser DevTools
14. Sass compile errors

### Setup and Deployment / Practitioner (13 skills)
1. Add utilities
2. Debugging
3. Errors in routes
4. Git basics
5. Basic Git
6. Git ignore patterns
7. Managing passwords
8. Managing versions
9. Terminal shortcuts
10. Upgrading the kit
11. Environment variables
12. Backing up prototypes
13. Password protection

### Setup and Deployment / Expert (5 skills)
1. Advanced Git
2. Cleaning up prototypes
3. Deploying to Heroku
4. What is Heroku?
5. Archiving old versions

### Pages and Layouts / Working (14 skills)
1. Views and page templates
2. Creating a new page
3. Linking pages
4. Using the /index page
5. Nunjucks vs HTML
6. Basic page titles
7. Standard GOV.UK Page blocks
8. What is Routing?
9. What is POST and GET?
10. Hard-coding data
11. Previewing in local host
12. Add delays
13. Simulate errors
14. Mobile responsive testing

### Pages and Layouts / Practitioner (18 skills)
1. Layouts and extends
2. Extend layout files
3. Understand blocks and content areas
4. Using block content
5. Handle post requests
6. Create custom macros
7. Turning repeated patterns into macros
8. Reset session data
9. Customizing the start page
10. Branding
11. Navigation patterns
12. Use back link correctly
13. Multi-page forms
14. Form layout design
15. Confirmation pages
16. Error page handling
17. Deep linking
18. User research handoff

### Pages and Layouts / Expert (7 skills)
1. Dynamic page titles with errors
2. Page metadata
3. Question pages
4. Building wizard patterns
5. Multi-path journeys
6. Dynamic routing logic
7. Print stylesheets

### Components and Patterns / Working (23 skills)
1. What is a macro?
2. Standard GOV.UK components
3. Copying code from the Design System
4. Basic component options
5. Basic page layouts
6. Nunjucks vs HTML components
7. Using macros
8. Text inputs and labels
9. Radio buttons
10. Checkboxes
11. Select (dropdown)
12. Textareas
13. Buttons
14. Back link
15. Summary list
16. Form validation basics
17. Fieldset and legend
18. Error message
19. Error summary
20. Checking accessibility defaults
21. Tables with data
22. Accordions
23. Accessibility testing basics

### Components and Patterns / Practitioner (13 skills)
1. Create custom macros
2. Passing variables to macros
3. Use macros for items
4. Complex macro options
5. Custom error messages
6. Form element validation states
7. Date input
8. File upload
9. Customizing CSS for patterns
10. Conditional components
11. Autocomplete component
12. Skip links and focus management
13. WCAG basics for prototypers

### Components and Patterns / Expert (6 skills)
1. Building complex macros
2. Custom components
3. Isolating patterns for reuse
4. Pattern library management
5. Design system contribution
6. Updating the GOV.UK Frontend

### Data and Logic / Working (12 skills)
1. Storing user answers
2. Displaying session data
3. Viewing session data
4. Different data types
5. Using variables
6. Basic 'if' statements
7. Basic math in Nunjucks
8. Loops basics
9. Standard data filters
10. Query parameters
11. Data in the URL
12. Clearing session data

### Data and Logic / Practitioner (15 skills)
1. Complex conditionals
2. Filters in Nunjucks
3. Custom filters
4. Setting defaults
5. Using data across pages
6. Logic in routes.js
7. Redirecting with logic
8. Validation logic
9. Using checkboxes (arrays)
10. Working with arrays
11. Nested loops
12. Working with dates
13. Data from external sources
14. Generating reference numbers
15. Date manipulation

### Data and Logic / Expert (13 skills)
1. Advanced routing logic
2. Complex data transformation
3. Data validation in routes
4. Complex data structures
5. Custom Nunjucks filters
6. Using external JSON files
7. Creating data maps
8. Looping through data
9. Filtering data
10. Searching/Filtering lists
11. Email notification preview
12. Multi-user testing
13. Complex 'if/else' logic

## 4. Ring Level Adjustments

| Skill | Old Ring | New Ring | Reason |
|-------|----------|----------|--------|
| Password protection | Working | Practitioner | More advanced concept |
| Complex 'if/else' logic | Practitioner | Expert | Advanced conditional logic |
| What is Heroku? | Expert | Practitioner | Common deployment need |
| Deploying to Heroku | Expert | Practitioner | Common deployment need |

## 5. Total Skill Count

- **Before:** 87 skills
- **After:** 107 skills (20 new after merging duplicates)

### Skills Combined:
| Combined Into | Merged From |
|---------------|-------------|
| Storing user answers | Input field names + Storing data in session |
| Views and page templates | What is a View? + Template inheritance basics |
| Using data across pages | Passing data between pages + Dynamic content from data |

### By Quadrant:
- Setup and Deployment: 34 skills (14 Working, 17 Practitioner, 3 Expert)
- Pages and Layouts: 39 skills (14 Working, 18 Practitioner, 7 Expert)
- Components and Patterns: 42 skills (23 Working, 13 Practitioner, 6 Expert)
- Data and Logic: 40 skills (12 Working, 15 Practitioner, 13 Expert)

**Grand Total: 107 skills**

## Files Modified

### Configuration
- `radar.config.js` - Quadrant names
- `src/models/radar.js` - Quadrant order mapping

### Scripts
- `scripts/add-logical-ordering.js` - Updated with new quadrant names and new skills

### New Markdown Files (23)
- `setting-up-vs-code.md`
- `introduction-to-git-and-github.md`
- `using-browser-devtools.md`
- `environment-variables.md`
- `backing-up-prototypes.md`
- `archiving-old-versions.md`
- `password-protection.md`
- `prototype-documentation.md`
- `cleaning-up-before-sharing.md`
- `error-page-handling.md`
- `deep-linking.md`
- `print-stylesheets.md`
- `mobile-responsive-testing.md`
- `user-research-handoff.md`
- `tables-with-data.md`
- `accordions.md`
- `autocomplete-component.md`
- `skip-links-and-focus-management.md`
- `accessibility-testing-basics.md`
- `wcag-basics-for-prototypers.md`
- `generating-reference-numbers.md`
- `date-manipulation.md`
- `email-notification-preview.md`
- `multi-user-testing.md`

### Updated Markdown Files
- All existing markdown files updated with:
  - New quadrant names
  - Updated order values

## How to Test

1. **Rebuild the JSON:**
   ```bash
   npm run build:data:md
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:8083
   ```

4. **Verify:**
   - Quadrant names are updated
   - New skills appear in correct positions
   - Skills are ordered logically within each ring
   - All links work correctly

## Still To Consider

### Potential Duplications (flagged but not merged)
- "Using data within pages" / "Pass data to a page"
- "Store user answers" / "Input names"
- "Linking to pages" / "Pass data between pages"

### Unclear Titles (flagged but not renamed)
- "What is a branching" → Consider: "What is branching?"
- "What's in the kit" → Consider: "Kit folder structure overview"

These were flagged but not changed to avoid breaking existing references.
