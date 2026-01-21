const d3 = require('d3')

let currentViewMode = 'quadrants' // 'quadrants', 'number', or 'levels'

// Ring order - Working first, Expert last
const RING_ORDER = {
  'Working': 0,
  'Practitioner': 1,
  'Expert': 2
}

// Quadrant order (clockwise)
const QUADRANT_ORDER = {
  'Setup and Deployment': 0,
  'Pages and Layouts': 1,
  'Components and Patterns': 2,
  'Data and Logic': 3
}

function createViewByQuadrants(container, radar) {
  // Get all quadrants
  const quadrants = radar.quadrants()

  const sortedQuadrants = quadrants.sort((a, b) => {
    const orderA = QUADRANT_ORDER[a.quadrant.name()] !== undefined ? QUADRANT_ORDER[a.quadrant.name()] : 999
    const orderB = QUADRANT_ORDER[b.quadrant.name()] !== undefined ? QUADRANT_ORDER[b.quadrant.name()] : 999
    return orderA - orderB
  })


  // Render each quadrant
  sortedQuadrants.forEach(quadrantWrapper => {
    const quadrant = quadrantWrapper.quadrant
    const quadrantDiv = container.append('div')
      .attr('class', 'list-view__quadrant')

    quadrantDiv.append('h2')
      .attr('class', 'list-view__quadrant-title')
      .text(quadrant.name())

    // Group blips by ring
    const blipsByRing = {}
    quadrant.blips().forEach(blip => {
      const ringName = blip.ring().name()
      if (!blipsByRing[ringName]) {
        blipsByRing[ringName] = []
      }
      blipsByRing[ringName].push(blip)
    })

    // Sort rings - Working, Practitioner, Expert
    const sortedRings = Object.keys(blipsByRing).sort((a, b) => {
      const orderA = RING_ORDER[a] !== undefined ? RING_ORDER[a] : 999
      const orderB = RING_ORDER[b] !== undefined ? RING_ORDER[b] : 999
      return orderA - orderB
    })

    // Render each ring
    sortedRings.forEach(ringName => {
      const ringDiv = quadrantDiv.append('div')
        .attr('class', 'list-view__ring')

      ringDiv.append('h3')
        .attr('class', 'list-view__ring-title')
        .text(ringName)

      // Sort blips by number
      const sortedBlips = blipsByRing[ringName].sort((a, b) => {
        const numA = a.blipText() ? parseInt(a.blipText()) : 999
        const numB = b.blipText() ? parseInt(b.blipText()) : 999
        return numA - numB
      })

      renderBlips(ringDiv, sortedBlips)
    })
  })
}

function createViewByNumber(container, radar) {
  const allBlips = []

  // Collect all blips
  radar.quadrants().forEach(quadrantWrapper => {
    quadrantWrapper.quadrant.blips().forEach(blip => {
      allBlips.push(blip)
    })
  })

  // Sort by number
  allBlips.sort((a, b) => {
    const numA = a.blipText() ? parseInt(a.blipText()) : 999
    const numB = b.blipText() ? parseInt(b.blipText()) : 999
    return numA - numB
  })

  const sectionDiv = container.append('div')
    .attr('class', 'list-view__quadrant')

  sectionDiv.append('h2')
    .attr('class', 'list-view__quadrant-title')
    .text('All Skills by Number')

  renderBlips(sectionDiv, allBlips)
}

function createViewByLevels(container, radar) {
  const blipsByRing = {}

  // Collect all blips grouped by ring
  radar.quadrants().forEach(quadrantWrapper => {
    quadrantWrapper.quadrant.blips().forEach(blip => {
      const ringName = blip.ring().name()
      if (!blipsByRing[ringName]) {
        blipsByRing[ringName] = []
      }
      blipsByRing[ringName].push(blip)
    })
  })

  // Sort rings - Working, Practitioner, Expert
  const sortedRings = Object.keys(blipsByRing).sort((a, b) => {
    const orderA = RING_ORDER[a] !== undefined ? RING_ORDER[a] : 999
    const orderB = RING_ORDER[b] !== undefined ? RING_ORDER[b] : 999
    return orderA - orderB
  })

  // Render each ring
  sortedRings.forEach(ringName => {
    const ringDiv = container.append('div')
      .attr('class', 'list-view__quadrant')

    ringDiv.append('h2')
      .attr('class', 'list-view__quadrant-title')
      .text(ringName)

    // Sort blips by number
    const sortedBlips = blipsByRing[ringName].sort((a, b) => {
      const numA = a.blipText() ? parseInt(a.blipText()) : 999
      const numB = b.blipText() ? parseInt(b.blipText()) : 999
      return numA - numB
    })

    renderBlips(ringDiv, sortedBlips)
  })
}

function renderBlips(container, blips) {
  blips.forEach(blip => {
    const skillDiv = container.append('div')
      .attr('class', 'list-view__skill')

    const skillHeader = skillDiv.append('button')
      .attr('class', 'list-view__skill-header')
      .attr('aria-expanded', 'false')
      .on('click', function() {
        const isExpanded = d3.select(this).attr('aria-expanded') === 'true'
        d3.select(this).attr('aria-expanded', !isExpanded)
        d3.select(this.parentNode).classed('expanded', !isExpanded)
      })

    skillHeader.append('span')
      .attr('class', 'list-view__skill-number')
      .text('#' + blip.blipText())

    skillHeader.append('h4')
      .attr('class', 'list-view__skill-name')
      .text(blip.name())

    skillHeader.append('span')
      .attr('class', 'list-view__skill-arrow')
      .html('▼')

    skillDiv.append('div')
      .attr('class', 'list-view__skill-content')
      .html(blip.description())
  })
}

function createListView(radar) {
  // Remove existing list view if present
  d3.select('#list-view').remove()

  // Create container for list view
  const listViewContainer = d3.select('main')
    .append('div')
    .attr('class', 'list-view')
    .attr('id', 'list-view')
    .classed('active', true)

  // Add header
  const header = listViewContainer.append('div')
    .attr('class', 'list-view__header')

  header.append('h1')
    .text(document.title || 'Prototype Kit Skills Radar')

  header.append('p')
    .text('A comprehensive guide to GOV.UK and NHS.UK prototyping skills')

  // Add view mode selector
  const viewSelector = header.append('div')
    .attr('class', 'list-view__view-selector')

  viewSelector.append('span')
    .attr('class', 'list-view__view-label')
    .text('View by: ')

  const buttonGroup = viewSelector.append('div')
    .attr('class', 'list-view__button-group')

  buttonGroup.append('button')
    .attr('class', 'list-view__view-button')
    .classed('active', currentViewMode === 'quadrants')
    .text('Quadrants')
    .on('click', function() {
      currentViewMode = 'quadrants'
      createListView(radar)
    })

  buttonGroup.append('button')
    .attr('class', 'list-view__view-button')
    .classed('active', currentViewMode === 'number')
    .text('By Number')
    .on('click', function() {
      currentViewMode = 'number'
      createListView(radar)
    })

  buttonGroup.append('button')
    .attr('class', 'list-view__view-button')
    .classed('active', currentViewMode === 'levels')
    .text('By Level')
    .on('click', function() {
      currentViewMode = 'levels'
      createListView(radar)
    })

  // Add expand/collapse all button to the same bar
  buttonGroup.append('button')
    .attr('class', 'list-view__view-button list-view__expand-button')
    .text('Expand All')
    .on('click', function() {
      const allSkills = d3.selectAll('.list-view__skill')
      const allHeaders = d3.selectAll('.list-view__skill-header')
      const isExpanding = d3.select(this).text() === 'Expand All'

      if (isExpanding) {
        allSkills.classed('expanded', true)
        allHeaders.attr('aria-expanded', 'true')
        d3.select(this).text('Collapse All')
      } else {
        allSkills.classed('expanded', false)
        allHeaders.attr('aria-expanded', 'false')
        d3.select(this).text('Expand All')
      }
    })

  // Render content based on current view mode
  if (currentViewMode === 'quadrants') {
    createViewByQuadrants(listViewContainer, radar)
  } else if (currentViewMode === 'number') {
    createViewByNumber(listViewContainer, radar)
  } else if (currentViewMode === 'levels') {
    createViewByLevels(listViewContainer, radar)
  }
}

function initializeToggle(radar) {
  // Remove existing toggle if present
  d3.select('.view-toggle').remove()

  // Create toggle button
  const toggle = d3.select('body')
    .append('div')
    .attr('class', 'view-toggle')

  const button = toggle.append('button')
    .attr('class', 'view-toggle__button')
    .text('📄 List View')

  let isListView = false

  button.on('click', function() {
    isListView = !isListView

    if (isListView) {
      // Switch to list view
      d3.select('body').classed('list-view-active', true)
      button.text('🎯 Radar View')

      // Create list view
      createListView(radar)
    } else {
      // Switch to radar view
      d3.select('body').classed('list-view-active', false)
      d3.select('#list-view').classed('active', false)
      button.text('📄 List View')
    }
  })

  // Show the toggle
  toggle.classed('visible', true)
}

module.exports = {
  createListView,
  initializeToggle
}
