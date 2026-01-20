// eslint-disable-next-line no-unused-vars
const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each'),
}

const MalformedDataError = require('../../src/exceptions/malformedDataError')
const ExceptionMessages = require('./exceptionMessages')

const ContentValidator = function (columnNames) {
  var self = {}
  columnNames = columnNames.map(function (columnName) {
    return columnName.trim()
  })

  // Debug logging
  console.log('ContentValidator columnNames:', columnNames)

  self.verifyContent = function () {
    if (columnNames.length === 0) {
      throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT)
    }
  }

  self.verifyHeaders = function () {
    let nameValid = false
    let ringValid = false
    let quadrantValid = false
    let descriptionValid = false
    let isNewValid = false
    let statusValid = false

    columnNames.forEach(function (field) {
      switch (field?.toLowerCase())
      {
        case "capability":
        case "name":
          nameValid = true
          break
        case "maturity level":
        case "ring":
          ringValid = true
          break
        case "quadrant":
          quadrantValid = true
          break
        case "description":
        case "description\nfill this later...":
          descriptionValid = true
          break
        case "isNew":
        case "isnew":
          isNewValid = true
          break
        case "status":
        case "grow, hold, or wither":
          statusValid = true
    }})

    // Debug logging
    console.log('Validation results:', { nameValid, ringValid, quadrantValid, descriptionValid, isNewValid, statusValid })

    if (!nameValid || !ringValid || !quadrantValid || !descriptionValid)
    {
      throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
    }

    if (!isNewValid && !statusValid)
    {
      throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS)
    }
  }

  return self
}

module.exports = ContentValidator
