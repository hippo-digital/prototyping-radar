const MalformedDataError = require('../exceptions/malformedDataError')
const ExceptionMessages = require('../util/exceptionMessages')

const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  sortBy: require('lodash/sortBy'),
}

const Radar = function () {
  const config = require('../config')
  const featureToggles = config().featureToggles

  let self, quadrants, blipNumber, addingQuadrant, alternatives, currentSheetName, rings

  blipNumber = 0
  addingQuadrant = 0
  quadrants = featureToggles.UIRefresh2022
    ? [
        { order: 'first', startAngle: 0 },
        { order: 'second', startAngle: -90 },
        { order: 'third', startAngle: 90 },
        { order: 'fourth', startAngle: -180 },
      ]
    : [
        { order: 'first', startAngle: 90 },
        { order: 'second', startAngle: 0 },
        { order: 'third', startAngle: -90 },
        { order: 'fourth', startAngle: -180 },
      ]
  alternatives = []
  currentSheetName = ''
  self = {}
  rings = {}

  function setNumbers(blips) {
    blips.forEach(function (blip) {
      ++blipNumber
      blip.setBlipText(blipNumber)
      blip.setId(blipNumber)
    })
  }

  // Renumber all blips in clockwise order by ring
  function renumberBlipsClockwise() {
    // Define the desired quadrant order (clockwise)
    // quadrants are added in config order: Run and maintain (0), Pages and journeys (1), Components and patterns (3), Data and Logic (2)
    // We want clockwise: Run and maintain (0), Pages and journeys (1), Components and patterns (2), Data and Logic (3)
    const quadrantOrder = {
      'Run and maintain': 0,
      'Pages and journeys': 1,
      'Components and patterns': 2,
      'Data and Logic': 3
    }

    // Debug: Log which quadrants we have and in what order
    console.log('Quadrants array:')
    console.log('quadrantOrder mapping keys:', Object.keys(quadrantOrder))
    quadrants.forEach(function (quadrant, index) {
      if (quadrant.quadrant) {
        const qName = quadrant.quadrant.name()
        const qOrder = quadrantOrder[qName]
        const qNameBytes = []
        for (let i = 0; i < qName.length; i++) {
          qNameBytes.push(qName.charCodeAt(i))
        }
        console.log(`  [${index}] "${qName}" (bytes: ${qNameBytes.join(',')}) - ${quadrant.quadrant.blips().length} blips - quadrantOrder=${qOrder} (${qOrder === undefined ? 'UNDEFINED!' : 'ok'})`)
      }
    })

    // Collect all blips from all quadrants with their metadata
    const allBlipsWithMetadata = []
    quadrants.forEach(function (quadrant, quadrantIndex) {
      if (quadrant.quadrant) {
        quadrant.quadrant.blips().forEach(function (blip) {
          const ringName = blip.ring().name()
          const ringOrder = blip.ring().order()
          const quadrantName = quadrant.quadrant.name()
          const quadOrder = quadrantOrder[quadrantName]

          allBlipsWithMetadata.push({
            blip: blip,
            ringOrder: ringOrder,
            quadrantOrder: quadOrder !== undefined ? quadOrder : 999,
            quadrantName: quadrantName,
            quadrantIndex: quadrantIndex,
            ringName: ringName
          })
        })
      }
    })

    // Debug: Show sample of blips from Run and maintain
    const runMaintainAll = allBlipsWithMetadata.filter(item => item.quadrantOrder === 0)
    console.log(`\nAll Run and maintain blips: ${runMaintainAll.length}`)
    runMaintainAll.slice(0, 5).forEach(item => {
      console.log(`  - ${item.blip.name()} | ring="${item.ringName}" | ringOrder=${item.ringOrder}`)
    })

    // Sort by ring first (Working=0, Practitioner=1, Expert=2), then by quadrant order (clockwise), then by name
    allBlipsWithMetadata.sort(function (a, b) {
      if (a.ringOrder !== b.ringOrder) {
        return a.ringOrder - b.ringOrder
      }
      if (a.quadrantOrder !== b.quadrantOrder) {
        return a.quadrantOrder - b.quadrantOrder
      }
      // Within same ring and quadrant, sort alphabetically by name
      return a.blip.name().localeCompare(b.blip.name())
    })

    // Debug: Show all Run and maintain + Working blips
    const runMaintainWorking = allBlipsWithMetadata.filter(item =>
      item.ringOrder === 0 && item.quadrantOrder === 0
    )
    console.log(`Run and maintain + Working blips: ${runMaintainWorking.length}`)
    runMaintainWorking.slice(0, 5).forEach(item => {
      console.log(`  - ${item.blip.name()}`)
    })

    // Debug: Log the first few blips to verify ordering
    console.log('First 10 blips after sorting:')
    allBlipsWithMetadata.slice(0, 10).forEach(function(item, index) {
      console.log(`#${index + 1}: ${item.blip.name()} - ${item.quadrantName} - ${item.blip.ring().name()} (ring=${item.ringOrder}, quad=${item.quadrantOrder}, addedAt=${item.quadrantIndex})`)
    })

    // Renumber all blips in sorted order
    blipNumber = 0
    allBlipsWithMetadata.forEach(function (item) {
      ++blipNumber
      item.blip.setBlipText(blipNumber)
      item.blip.setId(blipNumber)
    })
  }

  self.addAlternative = function (sheetName) {
    alternatives.push(sheetName)
  }

  self.getAlternatives = function () {
    return alternatives
  }

  self.setCurrentSheet = function (sheetName) {
    currentSheetName = sheetName
  }

  self.getCurrentSheet = function () {
    return currentSheetName
  }

  self.addQuadrant = function (quadrant) {
    if (addingQuadrant >= 4) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS)
    }
    quadrants[addingQuadrant].quadrant = quadrant
    // Don't number immediately - wait until all quadrants are added
    addingQuadrant++

    // If all quadrants have been added, renumber everything in clockwise order
    if (addingQuadrant === 4) {
      renumberBlipsClockwise()
    }
  }

  self.addRings = function (allRings) {
    rings = allRings
  }

  function allQuadrants() {
    if (addingQuadrant < 4) {
      throw new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS)
    }

    return _.map(quadrants, 'quadrant')
  }

  function allBlips() {
    return allQuadrants().reduce(function (blips, quadrant) {
      return blips.concat(quadrant.blips())
    }, [])
  }

  self.rings = function () {
    if (featureToggles.UIRefresh2022) {
      return rings
    }

    return _.sortBy(
      _.map(
        _.uniqBy(allBlips(), function (blip) {
          return blip.ring().name()
        }),
        function (blip) {
          return blip.ring()
        },
      ),
      function (ring) {
        return ring.order()
      },
    )
  }

  self.quadrants = function () {
    return quadrants
  }

  return self
}

module.exports = Radar
