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
            customOrder: blip.order ? blip.order() : null
          })
        })
      }
    })

    // Sort by ring first (Working=0, Practitioner=1, Expert=2),
    // then by quadrant order (clockwise),
    // then by custom order if provided,
    // then alphabetically by name
    allBlipsWithMetadata.sort(function (a, b) {
      if (a.ringOrder !== b.ringOrder) {
        return a.ringOrder - b.ringOrder
      }
      if (a.quadrantOrder !== b.quadrantOrder) {
        return a.quadrantOrder - b.quadrantOrder
      }
      // Use custom order if both have it
      if (a.customOrder !== null && b.customOrder !== null) {
        return a.customOrder - b.customOrder
      }
      // Items with custom order come before items without
      if (a.customOrder !== null) return -1
      if (b.customOrder !== null) return 1
      // Within same ring and quadrant, sort alphabetically by name
      return a.blip.name().localeCompare(b.blip.name())
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
