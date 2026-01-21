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
  'Run and maintain / Working': {
    'Installing the kit': 1,
    'Node.js basics': 2,
    'NPM packages': 3,
    'Terminal basics': 4,
    'Running the kit locally': 5,
    'Restarting the kit': 6,
    "What's in the kit": 7,
    'Folder structure': 8,
    'Assets folder': 9,
    'Update notifications': 10,
    'Sass compile errors': 11,
  },
  'Run and maintain / Practitioner': {
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
  },
  'Run and maintain / Expert': {
    'Advanced Git': 1,
    'Cleaning up prototypes': 2,
    'Deploying to Heroku': 3,
    'What is Heroku?': 4,
  },
  'Pages and journeys / Working': {
    'What is a View?': 1,
    'Creating a new page': 2,
    'Linking pages': 3,
    'Using the /index page': 4,
    'Nunjucks vs HTML': 5,
    'Basic page titles': 6,
    'Standard GOV.UK Page blocks': 7,
    'Template inheritance basics': 8,
    'What is Routing?': 9,
    'What is POST and GET?': 10,
    'Hard-coding data': 11,
    'Previewing in local host': 12,
    'Add delays': 13,
    'Simulate errors': 14,
  },
  'Pages and journeys / Practitioner': {
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
  },
  'Pages and journeys / Expert': {
    'Dynamic page titles with errors': 1,
    'Page metadata': 2,
    'Question pages': 3,
    'Building wizard patterns': 4,
    'Multi-path journeys': 5,
    'Dynamic routing logic': 6,
  },
  'Components and patterns / Working': {
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
  },
  'Components and patterns / Practitioner': {
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
  },
  'Components and patterns / Expert': {
    'Building complex macros': 1,
    'Custom components': 2,
    'Isolating patterns for reuse': 3,
    'Pattern library management': 4,
    'Design system contribution': 5,
    'Updating the GOV.UK Frontend': 6,
  },
  'Data and Logic / Working': {
    'Input field names': 1,
    'Storing data in session': 2,
    'Displaying session data': 3,
    'Viewing session data': 4,
    'Different data types': 5,
    'Using variables': 6,
    "Basic 'if' statements": 7,
    'Basic math in Nunjucks': 8,
    'Loops basics': 9,
    'Standard data filters': 10,
    'Query parameters': 11,
    'Data in the URL': 12,
    'Clearing session data': 13,
  },
  'Data and Logic / Practitioner': {
    "Complex 'if/else' logic": 1,
    'Complex conditionals': 2,
    'Filters in Nunjucks': 3,
    'Custom filters': 4,
    'Setting defaults': 5,
    'Passing data between pages': 6,
    'Logic in routes.js': 7,
    'Redirecting with logic': 8,
    'Validation logic': 9,
    'Using checkboxes (arrays)': 10,
    'Working with arrays': 11,
    'Nested loops': 12,
    'Working with dates': 13,
    'Dynamic content from data': 14,
    'Data from external sources': 15,
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
