const d3 = require('d3')
const { graphConfig, getScale, uiConfig } = require('../config')
const { stickQuadrantOnScroll } = require('./quadrants')
const { removeAllSpaces } = require('../../util/stringUtil')
const feedbackConfig = require('../../../feedback.config')

function addTargetBlankToExternalLinks(html) {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Find all links
  const links = tempDiv.querySelectorAll('a[href]')
  links.forEach(link => {
    const href = link.getAttribute('href')
    // Check if it's an external link (starts with http:// or https://)
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    }
  })

  return tempDiv.innerHTML
}

function generateFeedbackLink(blip, ring, quadrant) {
  if (!feedbackConfig.enabled) {
    return ''
  }

  const { repoOwner, repoName, mdFilePath, issueLabel } = feedbackConfig
  const filePath = `${mdFilePath}/${blip.filename()}.md`

  const issueTitle = encodeURIComponent(`Feedback: ${blip.name()}`)
  const issueBody = encodeURIComponent(
    `## Skill: ${blip.name()}\n\n` +
    `**Ring:** ${ring.name()}\n` +
    `**Quadrant:** ${quadrant.quadrant.name()}\n\n` +
    `**File:** [${filePath}](https://github.com/${repoOwner}/${repoName}/blob/main/${filePath})\n\n` +
    `---\n\n` +
    `### What needs improving?\n\n` +
    `<!-- Please describe your suggested improvement -->\n\n` +
    `- [ ] Description needs updating\n` +
    `- [ ] "Why is it important?" section needs work\n` +
    `- [ ] "Where to learn more" links need updating\n` +
    `- [ ] Ring placement is incorrect\n` +
    `- [ ] Other (please specify below)\n\n` +
    `### Your suggestion:\n\n`
  )

  const githubUrl = `https://github.com/${repoOwner}/${repoName}/issues/new?title=${issueTitle}&body=${issueBody}&labels=${issueLabel}`

  const githubIcon = `<svg class="github-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>`

  return `
    <p class="blip-feedback-link">
      <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">
        ${githubIcon} Leave feedback about this skill
      </a>
    </p>
  `
}

function fadeOutAllBlips() {
  d3.selectAll('g > a.blip-link').attr('opacity', 0.3)
}

function fadeInSelectedBlip(selectedBlipOnGraph) {
  selectedBlipOnGraph.attr('opacity', 1.0)
}

function highlightBlipInTable(selectedBlip) {
  selectedBlip.classed('highlight', true)
}

function highlightBlipInGraph(blipIdToFocus) {
  fadeOutAllBlips()
  const selectedBlipOnGraph = d3.select(`g > a.blip-link[data-blip-id='${blipIdToFocus}'`)
  fadeInSelectedBlip(selectedBlipOnGraph)
}

function renderBlipDescription(blip, ring, quadrant, tip, groupBlipTooltipText) {
  let blipTableItem = d3.select(`.quadrant-table.${quadrant.order} ul[data-ring-order='${ring.order()}']`)
  if (!groupBlipTooltipText) {
    blipTableItem = blipTableItem.append('li').classed('blip-list__item', true)
    const blipItemDiv = blipTableItem
      .append('div')
      .classed('blip-list__item-container', true)
      .attr('data-blip-id', blip.id())

    if (blip.groupIdInGraph()) {
      blipItemDiv.attr('data-group-id', blip.groupIdInGraph())
    }

    const blipItemContainer = blipItemDiv
      .append('button')
      .classed('blip-list__item-container__name', true)
      .attr('aria-expanded', 'false')
      .attr('aria-controls', `blip-description-${blip.id()}`)
      .attr('aria-hidden', 'true')
      .attr('tabindex', -1)
      .on('click search-result-click', function (e) {
        e.stopPropagation()

        const expandFlag = d3.select(e.target.parentElement).classed('expand')

        d3.selectAll('.blip-list__item-container.expand').classed('expand', false)
        d3.select(e.target.parentElement).classed('expand', !expandFlag)

        d3.selectAll('.blip-list__item-container__name').attr('aria-expanded', 'false')
        d3.select('.blip-list__item-container.expand .blip-list__item-container__name').attr('aria-expanded', 'true')

        if (window.innerWidth >= uiConfig.tabletViewWidth) {
          stickQuadrantOnScroll()
        }
      })

    blipItemContainer
      .append('span')
      .classed('blip-list__item-container__name-value', true)
      .text(`${blip.blipText()}. ${blip.name()}`)
    blipItemContainer.append('span').classed('blip-list__item-container__name-arrow', true)

    // Process description to add target="_blank" to external links
    const processedDescription = addTargetBlankToExternalLinks(blip.description())

    const descriptionDiv = blipItemDiv
      .append('div')
      .classed('blip-list__item-container__description', true)
      .attr('id', `blip-description-${blip.id()}`)
      .html(processedDescription)

    // Add feedback link if filename exists
    if (blip.filename && blip.filename()) {
      const feedbackHtml = generateFeedbackLink(blip, ring, quadrant)
      descriptionDiv.append('div').html(feedbackHtml)
    }
  }
  const blipGraphItem = d3.select(`g a#blip-link-${removeAllSpaces(blip.id())}`)
  const mouseOver = function (e) {
    const targetElement = e.target.classList.contains('blip-link') ? e.target : e.target.parentElement
    const isGroupIdInGraph = !targetElement.classList.contains('blip-link') ? true : false
    const blipWrapper = d3.select(targetElement)
    const blipIdToFocus = blip.groupIdInGraph() ? blipWrapper.attr('data-group-id') : blipWrapper.attr('data-blip-id')
    const selectedBlipOnGraph = d3.select(`g > a.blip-link[data-blip-id='${blipIdToFocus}'`)
    highlightBlipInGraph(blipIdToFocus)
    highlightBlipInTable(blipTableItem)

    const isQuadrantView = d3.select('svg#radar-plot').classed('quadrant-view')
    const displayToolTip = blip.isGroup() ? !isQuadrantView : !blip.groupIdInGraph()
    const toolTipText = blip.isGroup() ? groupBlipTooltipText : blip.name()

    if (displayToolTip && !isGroupIdInGraph) {
      tip.show(toolTipText, selectedBlipOnGraph.node())

      const selectedBlipCoords = selectedBlipOnGraph.node().getBoundingClientRect()

      const tipElement = d3.select('div.d3-tip')
      const tipElementCoords = tipElement.node().getBoundingClientRect()

      tipElement
        .style(
          'left',
          `${parseInt(
            selectedBlipCoords.left + window.scrollX - tipElementCoords.width / 2 + selectedBlipCoords.width / 2,
          )}px`,
        )
        .style('top', `${parseInt(selectedBlipCoords.top + window.scrollY - tipElementCoords.height)}px`)
    }
  }

  const mouseOut = function () {
    d3.selectAll('g > a.blip-link').attr('opacity', 1.0)
    blipTableItem.classed('highlight', false)
    tip.hide().style('left', 0).style('top', 0)
  }

  const blipClick = function (e) {
    const isQuadrantView = d3.select('svg#radar-plot').classed('quadrant-view')
    const targetElement = e.target.classList.contains('blip-link') ? e.target : e.target.parentElement
    if (isQuadrantView) {
      e.stopPropagation()
    }

    return performBlipClick(targetElement)
  }

  !groupBlipTooltipText &&
    blipTableItem.on('mouseover', mouseOver).on('mouseout', mouseOut).on('focusin', mouseOver).on('focusout', mouseOut)
  blipGraphItem
    .on('mouseover', mouseOver)
    .on('mouseout', mouseOut)
    .on('focusin', mouseOver)
    .on('focusout', mouseOut)
    .on('click', blipClick)
}

function renderQuadrantTables(quadrants, rings) {
  const radarContainer = d3.select('#radar')

  const quadrantTablesContainer = radarContainer.append('div').classed('quadrant-table__container', true)
  quadrants.forEach(function (quadrant) {
    const scale = getScale()
    let quadrantContainer
    if (window.innerWidth < uiConfig.tabletViewWidth && window.innerWidth >= uiConfig.mobileViewWidth) {
      quadrantContainer = quadrantTablesContainer
        .append('div')
        .classed('quadrant-table', true)
        .classed(quadrant.order, true)
        .style(
          'margin',
          `${
            graphConfig.quadrantHeight * scale +
            graphConfig.quadrantsGap * scale +
            graphConfig.quadrantsGap * 2 +
            uiConfig.legendsHeight
          }px auto 0px`,
        )
        .style('left', '0')
        .style('right', 0)
    } else {
      quadrantContainer = quadrantTablesContainer
        .append('div')
        .classed('quadrant-table', true)
        .classed(quadrant.order, true)
    }

    const ringNames = Array.from(
      new Set(
        quadrant.quadrant
          .blips()
          .map((blip) => blip.ring())
          .map((ring) => ring.name()),
      ),
    )
    // Sort ring names by their order
    const sortedRingNames = ringNames
      .map((ringName) => rings.find((ring) => ring.name() === ringName))
      .filter((ring) => ring !== undefined)
      .sort((a, b) => a.order() - b.order())
      .map((ring) => ring.name())

    sortedRingNames.forEach(function (ringName) {
      quadrantContainer
        .append('h2')
        .classed('quadrant-table__ring-name', true)
        .attr('data-ring-name', ringName)
        .text(ringName)
      quadrantContainer
        .append('ul')
        .classed('blip-list', true)
        .attr('data-ring-order', rings.filter((ring) => ring.name() === ringName)[0].order())
    })
  })
}

function performBlipClick(targetElement) {
  const isQuadrantView = d3.select('svg#radar-plot').classed('quadrant-view')

  const blipId = d3.select(targetElement).attr('data-blip-id')
  highlightBlipInGraph(blipId)

  d3.selectAll('.blip-list__item-container.expand').classed('expand', false)

  let selectedBlipContainer = d3.select(`.blip-list__item-container[data-blip-id="${blipId}"`)
  selectedBlipContainer.classed('expand', true)

  setTimeout(
    () => {
      if (window.innerWidth >= uiConfig.tabletViewWidth) {
        stickQuadrantOnScroll()
      }

      const isGroupBlip = isNaN(parseInt(blipId))
      if (isGroupBlip) {
        selectedBlipContainer = d3.select(`.blip-list__item-container[data-group-id="${blipId}"`)
      }
      const elementToFocus = selectedBlipContainer.select('button.blip-list__item-container__name')
      elementToFocus.node()?.scrollIntoView({
        behavior: 'smooth',
      })
    },
    isQuadrantView ? 0 : 1500,
  )
}

module.exports = {
  renderQuadrantTables,
  renderBlipDescription,
  performBlipClick,
}
