#!/usr/bin/env node
/**
 * Add logical ordering to all skills based on learning progression
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const itemsDir = path.resolve(__dirname, '../data/items-md')

// Define logical ordering for each quadrant/ring combination
// Lower numbers appear first
const orderingRules = {
  'Setup and Deployment / Working': {
    'Setting up VS Code': 1,
    'Installing the kit': 2,
    'Node.js basics': 3,
    'NPM packages': 4,
    'Introduction to Git and GitHub': 5,
    'Terminal basics': 6,
    'Running the kit locally': 7,
    'Restarting the kit': 8,
    "What's in the kit": 9,
    'Folder structure': 10,
    'Assets folder': 11,
    'Update notifications': 12,
    'Using browser DevTools': 13,
    'Sass compile errors': 14,
  },
  'Setup and Deployment / Practitioner': {
    'Add utilities': 1,
    'Debugging': 2,
    'Errors in routes': 3,
    'Git basics': 4,
    'Basic Git': 5,
    'Git ignore patterns': 6,
    'Managing passwords': 7,
    'Managing versions': 8,
    'Terminal shortcuts': 9,
    'Upgrading the kit': 10,
    'Environment variables': 11,
    'Backing up prototypes': 12,
    'Password protection': 13,
    'Prototype documentation': 14,
    'Cleaning up before sharing': 15,
    'What is Heroku?': 16,
    'Deploying to Heroku': 17,
  },
  'Setup and Deployment / Expert': {
    'Advanced Git': 1,
    'Cleaning up prototypes': 2,
    'Archiving old versions': 3,
  },
  'Pages and Layouts / Working': {
    'Views and page templates': 1,
    'Creating a new page': 2,
    'Linking pages': 3,
    'Using the /index page': 4,
    'Nunjucks vs HTML': 5,
    'Basic page titles': 6,
    'Standard GOV.UK Page blocks': 7,
    'What is Routing?': 8,
    'What is POST and GET?': 9,
    'Hard-coding data': 10,
    'Previewing in local host': 11,
    'Add delays': 12,
    'Simulate errors': 13,
    'Mobile responsive testing': 14,
  },
  'Pages and Layouts / Practitioner': {
    'Layouts and extends': 1,
    'Extend layout files': 2,
    'Understand blocks and content areas': 3,
    'Using block content': 4,
    'Handle post requests': 5,
    'Create custom macros': 6,
    'Turning repeated patterns into macros': 7,
    'Reset session data': 8,
    'Customizing the start page': 9,
    'Branding': 10,
    'Navigation patterns': 11,
    'Use back link correctly': 12,
    'Multi-page forms': 13,
    'Form layout design': 14,
    'Confirmation pages': 15,
    'Error page handling': 16,
    'Deep linking': 17,
    'User research handoff': 18,
  },
  'Pages and Layouts / Expert': {
    'Dynamic page titles with errors': 1,
    'Page metadata': 2,
    'Question pages': 3,
    'Building wizard patterns': 4,
    'Multi-path journeys': 5,
    'Dynamic routing logic': 6,
    'Print stylesheets': 7,
  },
  'Components and Patterns / Working': {
    'What is a macro?': 1,
    'Standard GOV.UK components': 2,
    'Copying code from the Design System': 3,
    'Basic component options': 4,
    'Basic page layouts': 5,
    'Nunjucks vs HTML components': 6,
    'Using macros': 7,
    'Text inputs and labels': 8,
    'Radio buttons': 9,
    'Checkboxes': 10,
    'Select (dropdown)': 11,
    'Textareas': 12,
    'Buttons': 13,
    'Back link': 14,
    'Summary list': 15,
    'Form validation basics': 16,
    'Fieldset and legend': 17,
    'Error message': 18,
    'Error summary': 19,
    'Checking accessibility defaults': 20,
    'Tables with data': 21,
    'Accordions': 22,
    'Accessibility testing basics': 23,
  },
  'Components and Patterns / Practitioner': {
    'Create custom macros': 1,
    'Passing variables to macros': 2,
    'Use macros for items': 3,
    'Complex macro options': 4,
    'Custom error messages': 5,
    'Form element validation states': 6,
    'Date input': 7,
    'File upload': 8,
    'Customizing CSS for patterns': 9,
    'Conditional components': 10,
    'Autocomplete component': 11,
    'Skip links and focus management': 12,
    'WCAG basics for prototypers': 13,
  },
  'Components and Patterns / Expert': {
    'Building complex macros': 1,
    'Custom components': 2,
    'Isolating patterns for reuse': 3,
    'Pattern library management': 4,
    'Design system contribution': 5,
    'Updating the GOV.UK Frontend': 6,
  },
  'Data and Logic / Working': {
    'Storing user answers': 1,
    'Displaying session data': 2,
    'Viewing session data': 3,
    'Different data types': 4,
    'Using variables': 5,
    "Basic 'if' statements": 6,
    'Basic math in Nunjucks': 7,
    'Loops basics': 8,
    'Standard data filters': 9,
    'Query parameters': 10,
    'Data in the URL': 11,
    'Clearing session data': 12,
  },
  'Data and Logic / Practitioner': {
    'Complex conditionals': 1,
    'Filters in Nunjucks': 2,
    'Custom filters': 3,
    'Setting defaults': 4,
    'Using data across pages': 5,
    'Logic in routes.js': 6,
    'Redirecting with logic': 7,
    'Validation logic': 8,
    'Using checkboxes (arrays)': 9,
    'Working with arrays': 10,
    'Nested loops': 11,
    'Working with dates': 12,
    'Data from external sources': 13,
    'Generating reference numbers': 14,
    'Date manipulation': 15,
  },
  'Data and Logic / Expert': {
    'Advanced routing logic': 1,
    'Complex data transformation': 2,
    'Data validation in routes': 3,
    'Complex data structures': 4,
    'Custom Nunjucks filters': 5,
    'Using external JSON files': 6,
    'Creating data maps': 7,
    'Looping through data': 8,
    'Filtering data': 9,
    'Searching/Filtering lists': 10,
    'Email notification preview': 11,
    'Multi-user testing': 12,
    "Complex 'if/else' logic": 13,
  },
}

function updateMarkdownFile(filename) {
  const filePath = path.join(itemsDir, filename)

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filename}`)
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const parsed = matter(content)

  const quadrant = parsed.data.quadrant
  const ring = parsed.data.ring
  const name = parsed.data.name
  const key = `${quadrant} / ${ring}`

  const orderMap = orderingRules[key]

  if (!orderMap) {
    console.log(`  ⚠️  No ordering rules for: ${key}`)
    return
  }

  const order = orderMap[name]

  if (order === undefined) {
    console.log(`  ℹ️  No order defined for: ${name} (${key})`)
    return
  }

  // Update the frontmatter
  parsed.data.order = order

  // Write back to file
  const newContent = matter.stringify(parsed.content, parsed.data)
  fs.writeFileSync(filePath, newContent, 'utf8')

  console.log(`  ✅ ${name}: order = ${order}`)
}

console.log('🚀 Adding logical ordering to all skills...\n')

// Get all markdown files
const files = fs.readdirSync(itemsDir).filter(f => f.endsWith('.md'))

console.log(`Found ${files.length} markdown files\n`)

// Process each file
files.forEach(file => {
  updateMarkdownFile(file)
})

console.log('\n✨ Done! Run "npm run build:data:md" to regenerate the JSON file.')
