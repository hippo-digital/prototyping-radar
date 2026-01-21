# Logical Skill Ordering

## Overview

All 87 skills have been organized with a logical learning progression, making it easier for users to build their prototyping skills systematically from foundational to advanced within each quadrant and ring.

## Ordering Principles

### Learning Progression
Skills are ordered based on:
1. **Prerequisites** - What you need to know first
2. **Complexity** - Simple concepts before advanced ones
3. **Frequency of use** - Common tasks before rare ones
4. **Dependencies** - Core skills before specialized applications

### Quadrant-Specific Approach

Each quadrant follows a natural learning path for someone starting from scratch with the GOV.UK or NHS prototyping kit.

## Ordering by Quadrant

### Run and Maintain

**Working (11 skills):**
1. Installing the kit - First step
2. Node.js basics - Understanding the foundation
3. NPM packages - Managing dependencies
4. Terminal basics - Essential commands
5. Running the kit locally - Getting started
6. Restarting the kit - Basic troubleshooting
7. What's in the kit - Understanding structure
8. Folder structure - Navigating the codebase
9. Assets folder - Adding images and styles
10. Update notifications - Staying current
11. Sass compile errors - Fixing common issues

**Practitioner (10 skills):**
1. Add utilities - Extending functionality
2. Debugging - Finding and fixing issues
3. Errors in routes - Understanding routing errors
4. Git basics / Basic Git - Version control fundamentals
5. Git ignore patterns - Managing what's tracked
6. Managing passwords - Security basics
7. Managing versions - Maintaining multiple versions
8. Terminal shortcuts - Working efficiently
9-10. Upgrading the kit - Keeping current

**Expert (4 skills):**
1. Advanced Git - Branching and merging
2. Cleaning up prototypes - Maintenance
3. Deploying to Heroku - Publishing
4. What is Heroku? - Deployment platform

### Pages and Journeys

**Working (14 skills):**
1. What is a View? - Understanding templates
2. Creating a new page - First step in building
3. Linking pages - Creating navigation
4. Using the /index page - Homepage setup
5. Nunjucks vs HTML - Template language basics
6. Basic page titles - Essential metadata
7. Standard GOV.UK Page blocks - Common structures
8. Template inheritance basics - Reusing layouts
9. What is Routing? - Understanding navigation
10. What is POST and GET? - Form handling basics
11. Hard-coding data - Quick prototyping
12. Previewing in local host - Testing your work
13. Add delays - Simulating loading
14. Simulate errors - Testing error states

**Practitioner (15 skills):**
1. Layouts and extends - Advanced templates
2. Extend layout files - Customizing layouts
3. Understand blocks and content areas - Template structure
4. Using block content - Dynamic content areas
5. Handle post requests - Form processing
6-7. Creating and using custom macros
8. Reset session data - Clearing user data
9. Customizing the start page - Branding
10. Branding - Service identity
11. Navigation patterns - Menu systems
12. Use back link correctly - User flow
13. Multi-page forms - Complex journeys
14. Form layout design - Visual structure
15. Confirmation pages - Success states

**Expert (6 skills):**
1. Dynamic page titles with errors - Advanced metadata
2. Page metadata - SEO and sharing
3. Question pages - Patterns
4. Building wizard patterns - Complex flows
5. Multi-path journeys - Branching logic
6. Dynamic routing logic - Advanced navigation

### Components and Patterns

**Working (20 skills):**
1. What is a macro? - Component basics
2. Standard GOV.UK components - Available components
3. Copying code from the Design System - Using examples
4. Basic component options - Configuration
5. Basic page layouts - Grid system
6. Nunjucks vs HTML components - Template vs HTML
7-19. Individual component usage (inputs, buttons, etc.)
20. Checking accessibility defaults - A11y basics

**Practitioner (10 skills):**
1-3. Custom macros and passing variables
4. Complex macro options - Advanced configuration
5-6. Error messages and validation states
7-8. Date input and file upload
9. Customizing CSS for patterns - Styling
10. Conditional components - Dynamic display

**Expert (6 skills):**
1. Building complex macros - Advanced components
2. Custom components - Creating new patterns
3. Isolating patterns for reuse - Modular design
4. Pattern library management - Organization
5. Design system contribution - Giving back
6. Updating the GOV.UK Frontend - Maintenance

### Data and Logic

**Working (13 skills):**
1. Input field names - Form data basics
2. Storing data in session - Persistence
3. Displaying session data - Showing stored data
4. Viewing session data - Debugging data
5. Different data types - Understanding types
6. Using variables - Dynamic content
7. Basic 'if' statements - Conditional logic
8. Basic math in Nunjucks - Calculations
9. Loops basics - Iteration
10. Standard data filters - Formatting
11-12. Query parameters and URL data
13. Clearing session data - Reset functionality

**Practitioner (15 skills):**
1-2. Complex conditionals and if/else logic
3-4. Filters in Nunjucks and custom filters
5. Setting defaults - Fallback values
6. Passing data between pages - Data flow
7. Logic in routes.js - Server-side logic
8. Redirecting with logic - Dynamic navigation
9. Validation logic - Form validation
10. Using checkboxes (arrays) - Multi-select data
11. Working with arrays - Data collections
12. Nested loops - Complex iteration
13. Working with dates - Date manipulation
14. Dynamic content from data - Data-driven pages
15. Data from external sources - APIs and files

**Expert (10 skills):**
1. Advanced routing logic - Complex navigation
2. Complex data transformation - Processing
3. Data validation in routes - Server validation
4. Complex data structures - Objects and arrays
5. Custom Nunjucks filters - Advanced formatting
6. Using external JSON files - Data sources
7. Creating data maps - Data organization
8. Looping through data - Advanced iteration
9-10. Filtering and searching lists - Data queries

## How to Use This Ordering

### For Learners
- Start with skill #1 in each quadrant/ring and work sequentially
- Skills build on each other, so order matters
- Don't skip foundational skills even if they seem basic

### For Teachers/Mentors
- Use the ordering to create training curricula
- Skills are grouped for workshop planning
- Numbers indicate recommended teaching sequence

### For Skill Assessment
- Use the ordering to evaluate progression
- Lower numbers = foundational skills everyone should know
- Higher numbers = specialized or advanced skills

## Customizing the Order

If you need to adjust the ordering:

1. Edit `scripts/add-logical-ordering.js`
2. Update the order numbers in the relevant quadrant/ring section
3. Run: `node scripts/add-logical-ordering.js`
4. Rebuild: `npm run build:data:md`
5. Restart: `npm run dev`

## Benefits of Logical Ordering

✅ **Clear learning path** - Know what to learn next
✅ **Reduced overwhelm** - Start simple, build up
✅ **Better retention** - Each skill builds on previous ones
✅ **Efficient training** - Teach in the right order
✅ **Self-assessment** - Track your progress systematically

## Notes

- Some skills at the same level may not be strictly sequential
- The ordering is optimized for someone learning from scratch
- Experienced users can jump around as needed
- All skills remain searchable and filterable regardless of order
