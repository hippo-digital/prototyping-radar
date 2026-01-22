const d3 = require('d3')

const AssessmentFlow = function() {
  let assessments = {}
  let allBlips = []
  let selectedBlipIndex = 0

  function startAssessment() {
    allBlips = getAllBlipsFromRadar()
    assessments = loadExistingAssessments()

    showModal()
    renderSkillsList()
    selectBlip(0)
  }

  function loadExistingAssessments() {
    const saved = localStorage.getItem('hippo-skills-assessment')
    return saved ? JSON.parse(saved) : {}
  }

  function showModal() {
    const modal = d3.select('body')
      .append('div')
      .attr('class', 'assessment-modal-overlay')
      .on('click', function(event) {
        if (event.target === this) {
          confirmExit()
        }
      })

    modal.append('div')
      .attr('class', 'assessment-modal assessment-modal--wide')
      .html(`
        <div class="assessment-modal__header">
          <h2>Skills Self-Assessment</h2>
          <button class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="assessment-modal__body">
          <div class="assessment-column assessment-column--skills-ratings">
            <div class="skills-list-header">
              <h3>Skills (${allBlips.length})</h3>
              <div class="progress-indicator">
                <span class="progress-count">0/${allBlips.length}</span>
                <div class="progress-bar-mini">
                  <div class="progress-bar-fill"></div>
                </div>
              </div>
            </div>
            <div class="skills-list"></div>
          </div>
          
          <div class="assessment-column assessment-column--description">
            <div class="description-sticky">
              <div class="description-header">
                <h3 class="current-skill-name"></h3>
                <span class="current-skill-badge"></span>
              </div>
              <div class="description-content"></div>
            </div>
          </div>
        </div>
        <div class="assessment-modal__footer">
          <button class="btn btn-secondary btn-save-exit">💾 Save & Exit</button>
          <button class="btn btn-primary btn-complete">✅ Complete Assessment</button>
        </div>
      `)

    // Wire up buttons
    modal.select('.modal-close').on('click', confirmExit)
    modal.select('.btn-save-exit').on('click', saveAndExit)
    modal.select('.btn-complete').on('click', completeAssessment)

    d3.select('body').style('overflow', 'hidden')
  }

  function getAllBlipsFromRadar() {
    const radar = window.radar
    const blips = []

    // Collect all blips with their numbers
    radar.quadrants().forEach(quadrant => {
      quadrant.quadrant.blips().forEach(blip => {
        blips.push({
          blip: blip,
          quadrant: quadrant.quadrant,
          ring: blip.ring(),
          number: blip.blipText() ? parseInt(blip.blipText()) : 999
        })
      })
    })

    // Sort by number to maintain radar order
    blips.sort((a, b) => a.number - b.number)

    return blips
  }

  function getQuadrantOrder(quadrantName) {
    const order = {
      'Setup and Deployment': 0,
      'Pages and Layouts': 1,
      'Components and Patterns': 2,
      'Data and Logic': 3
    }
    return order[quadrantName] !== undefined ? order[quadrantName] : 999
  }

  function getRingOrder(ringName) {
    const order = {
      'Working': 0,
      'Practitioner': 1,
      'Expert': 2
    }
    return order[ringName] !== undefined ? order[ringName] : 999
  }

  function renderSkillsList() {
    const list = d3.select('.skills-list')

    let currentQuadrant = null
    let currentRing = null

    allBlips.forEach((item, index) => {
      const blip = item.blip
      const quadrantName = item.quadrant.name()
      const ringName = item.ring.name()

      // Add quadrant header if this is a new quadrant
      if (quadrantName !== currentQuadrant) {
        currentQuadrant = quadrantName
        currentRing = null // Reset ring when quadrant changes

        list.append('div')
          .attr('class', 'skills-list-quadrant-header')
          .attr('data-quadrant-order', getQuadrantOrder(quadrantName))
          .text(quadrantName)
      }

      // Add ring header if this is a new ring within the quadrant
      if (ringName !== currentRing) {
        currentRing = ringName

        list.append('div')
          .attr('class', 'skills-list-ring-header')
          .attr('data-ring-order', getRingOrder(ringName))
          .attr('data-quadrant-order', getQuadrantOrder(quadrantName))
          .text(ringName)
      }

      // Add skill item
      const listItem = list.append('div')
        .attr('class', 'skill-item')
        .attr('data-index', index)

      // Skill info section (clickable)
      const skillInfo = listItem.append('div')
        .attr('class', 'skill-info')
        .on('click', () => selectBlip(index))

      skillInfo.append('span')
        .attr('class', 'skill-number')
        .text(item.number) // Use radar number

      skillInfo.append('span')
        .attr('class', 'skill-name')
        .text(blip.name())

      skillInfo.append('span')
        .attr('class', 'skill-quadrant-tag')
        .attr('title', quadrantName)
        .text(quadrantName.substring(0, 1))

      skillInfo.append('span')
        .attr('class', 'skill-status')

      // Rating buttons section
      const rating = assessments[blip.name()]?.rating
      const ratingButtons = listItem.append('div')
        .attr('class', 'skill-rating-buttons')

      const ratings = [
        { value: 0, emoji: '⚪', title: 'Not Started' },
        { value: 1, emoji: '🌱', title: 'Learning' },
        { value: 2, emoji: '📚', title: 'Developing' },
        { value: 3, emoji: '⭐', title: 'Proficient' }
      ]

      ratings.forEach(r => {
        ratingButtons.append('button')
          .attr('class', 'rating-quick-button')
          .classed('selected', rating === r.value)
          .attr('data-rating', r.value)
          .attr('title', r.title)
          .text(r.emoji)
          .on('click', function(event) {
            event.stopPropagation()
            selectRating(blip, item.quadrant, r.value, index)
          })
      })
    })

    // Update progress based on existing assessments
    updateProgress()
    updateSkillStatuses()
  }

  function selectBlip(index) {
    selectedBlipIndex = index
    const item = allBlips[index]
    const blip = item.blip

    // Update selected state in skills list
    d3.selectAll('.skill-item').classed('selected', false)
    d3.select(`.skill-item[data-index="${index}"]`).classed('selected', true)

    // Update description panel
    d3.select('.current-skill-name').text(blip.name())

    const ringName = blip.ring().name().toLowerCase().replace(/\s+/g, '-')
    d3.select('.current-skill-badge')
      .attr('class', `current-skill-badge skill-badge-${ringName}`)
      .text(blip.ring().name())

    const description = blip.description() || '<p><em>No description available for this skill.</em></p>'
    d3.select('.description-content').html(description)

    // Note: Rating options removed - user rates from left column only

    // Scroll skills list to show selected item
    const skillItem = d3.select(`.skill-item[data-index="${index}"]`).node()
    if (skillItem) {
      skillItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  function selectRating(blip, quadrant, rating, index) {
    // Save rating
    assessments[blip.name()] = {
      rating,
      ring: blip.ring().name(),
      quadrant: quadrant.name(),
      timestamp: new Date().toISOString()
    }


    // Update quick rating buttons in skills list
    d3.select(`.skill-item[data-index="${index}"] .rating-quick-button`)
      .classed('selected', false)
    d3.select(`.skill-item[data-index="${index}"] .rating-quick-button[data-rating="${rating}"]`)
      .classed('selected', true)

    // Update skill item status
    d3.select(`.skill-item[data-index="${index}"] .skill-status`)
      .text('✓')
      .attr('class', 'skill-status skill-status--complete')

    // Update progress
    updateProgress()

    // Auto-save
    saveToLocalStorage()
  }

  function updateProgress() {
    const completed = Object.keys(assessments).length
    const total = allBlips.length

    d3.select('.progress-count').text(`${completed}/${total}`)
    d3.select('.progress-bar-fill').style('width', `${(completed / total) * 100}%`)
  }

  function updateSkillStatuses() {
    allBlips.forEach((item, index) => {
      if (assessments[item.blip.name()]) {
        d3.select(`.skill-item[data-index="${index}"] .skill-status`)
          .text('✓')
          .attr('class', 'skill-status skill-status--complete')
      }
    })
  }

  function saveToLocalStorage() {
    localStorage.setItem('hippo-skills-assessment', JSON.stringify(assessments))
  }

  function saveAndExit() {
    saveToLocalStorage()
    closeModal()
  }

  function completeAssessment() {
    const completed = Object.keys(assessments).length
    if (completed < allBlips.length) {
      if (!confirm(`You've assessed ${completed} of ${allBlips.length} skills. Complete assessment anyway?`)) {
        return
      }
    }

    saveToLocalStorage()
    showSummary()
  }

  function confirmExit() {
    if (Object.keys(assessments).length > 0) {
      if (confirm('Save your progress before exiting?')) {
        saveAndExit()
      } else {
        closeModal()
      }
    } else {
      closeModal()
    }
  }

  function closeModal() {
    d3.select('.assessment-modal-overlay').remove()
    d3.select('body').style('overflow', null)
  }

  function showSummary() {
    // Replace modal content with summary
    const modal = d3.select('.assessment-modal')
    modal.selectAll('*').remove()

    modal.attr('class', 'assessment-modal assessment-modal--summary')
      .html(`
        <button class="modal-close" aria-label="Close">×</button>
        <div class="summary-content">
          <div class="summary-header">
            <h2>🎉 Assessment Complete!</h2>
            <p>You've assessed ${Object.keys(assessments).length} skills</p>
          </div>
          <div class="summary-stats"></div>
          <div class="ai-recommendations-container">
            <div class="loading-ai">
              <div class="spinner"></div>
              <p>Generating personalized recommendations...</p>
            </div>
          </div>
          <div class="summary-actions">
            <button class="btn btn-secondary btn-export">📥 Export Results</button>
            <button class="btn btn-primary btn-close">Close</button>
          </div>
        </div>
      `)

    displayStats()
    generateAIRecommendations()

    modal.select('.modal-close').on('click', closeModal)
    modal.select('.btn-close').on('click', closeModal)
    modal.select('.btn-export').on('click', exportAssessment)
  }

  function displayStats() {
    const values = Object.values(assessments)
    const stats = {
      proficient: values.filter(a => a.rating === 3).length,
      developing: values.filter(a => a.rating === 2).length,
      learning: values.filter(a => a.rating === 1).length,
      notStarted: values.filter(a => a.rating === 0).length
    }

    const statsHtml = `
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-emoji">⭐</span>
          <span class="stat-number">${stats.proficient}</span>
          <span class="stat-label">Proficient</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">📚</span>
          <span class="stat-number">${stats.developing}</span>
          <span class="stat-label">Developing</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">🌱</span>
          <span class="stat-number">${stats.learning}</span>
          <span class="stat-label">Learning</span>
        </div>
        <div class="stat-card">
          <span class="stat-emoji">⚪</span>
          <span class="stat-number">${stats.notStarted}</span>
          <span class="stat-label">Not Started</span>
        </div>
      </div>
    `

    d3.select('.summary-stats').html(statsHtml)
  }

  function generateAIRecommendations() {
    // Placeholder for now - will implement Gemini integration next
    setTimeout(() => {
      d3.select('.loading-ai').remove()
      d3.select('.ai-recommendations-container').html(`
        <div class="ai-recommendations">
          <h3>🤖 Your Personalized Learning Plan</h3>
          <p><em>AI recommendations will be generated here using Gemini API</em></p>
          <p>This will analyze your assessment and provide:</p>
          <ul>
            <li>Top priority skills to focus on</li>
            <li>Suggested learning path</li>
            <li>Quick wins you can achieve</li>
            <li>Long-term development goals</li>
          </ul>
        </div>
      `)
    }, 1500)
  }

  function exportAssessment() {
    const exportData = {
      assessmentDate: new Date().toISOString(),
      totalSkills: allBlips.length,
      assessedSkills: Object.keys(assessments).length,
      assessments: assessments
    }

    const data = JSON.stringify(exportData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skills-assessment-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { startAssessment }
}

module.exports = AssessmentFlow
