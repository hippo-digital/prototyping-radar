const sanitizeHtml = require('sanitize-html')
const _ = {
  forOwn: require('lodash/forOwn'),
}

const InputSanitizer = function () {
  var relaxedOptions = {
    allowedTags: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'u',
      'code',
      'pre',
      'ul',
      'ol',
      'li',
      'blockquote',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href'],
    },
  }

  var restrictedOptions = {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: function (text) {
      return text.replace(/&amp;/, '&')
    },
  }

  function trimWhiteSpaces(blip) {
    var processedBlip = {}
    _.forOwn(blip, function (value, key) {
      var trimmedKey = key.trim()
      // Handle null values (e.g., order field) and non-string values
      if (value === null || value === undefined) {
        processedBlip[trimmedKey] = value
      } else if (typeof value === 'string') {
        processedBlip[trimmedKey] = value.trim()
      } else {
        processedBlip[trimmedKey] = value
      }
    })
    return processedBlip
  }

  var self = {}
  self.sanitize = function (rawBlip) {
    var blip = trimWhiteSpaces(rawBlip)
    blip.description = sanitizeHtml(blip.description, relaxedOptions)
    blip.name = sanitizeHtml(blip.name, restrictedOptions)
    blip.isNew = sanitizeHtml(blip.isNew, restrictedOptions)
    blip.status = sanitizeHtml(blip.status, restrictedOptions)
    blip.ring = sanitizeHtml(blip.ring, restrictedOptions)
    blip.quadrant = sanitizeHtml(blip.quadrant, restrictedOptions)

    return blip
  }

  self.sanitizeForProtectedSheet = function (rawBlip, header) {
    header = header.map(function (h) {
      return h?.trim()?.toLowerCase()
    })

    var blip = trimWhiteSpaces(rawBlip)

    let descriptionIndex = header.indexOf('description')
    let nameIndex = header.indexOf('name')
    let isNewIndex = header.indexOf('isNew')
    let statusIndex = header.indexOf('status')
    let quadrantIndex = header.indexOf('quadrant')
    let ringIndex = header.indexOf('ring')

    if (descriptionIndex === -1) descriptionIndex = header.indexOf('description\nfill this later...')

    if (nameIndex === -1) nameIndex = header.indexOf('capability')

    if (statusIndex === -1) statusIndex = header.indexOf('grow, hold, or wither')

    if (ringIndex === -1) ringIndex = header.indexOf('maturity level')

    const description = descriptionIndex === -1 ? '' : blip[descriptionIndex]
    const name = nameIndex === -1 ? '' : blip[nameIndex]
    const isNew = isNewIndex === -1 ? '' : blip[isNewIndex]
    const status = statusIndex === -1 ? '' : blip[statusIndex]
    const ring = ringIndex === -1 ? '' : blip[ringIndex]
    const quadrant = quadrantIndex === -1 ? '' : blip[quadrantIndex]

    blip.description = sanitizeHtml(description, relaxedOptions)
    blip.name = sanitizeHtml(name, restrictedOptions)
    blip.isNew = sanitizeHtml(isNew, restrictedOptions)
    blip.status = sanitizeHtml(status, restrictedOptions)
    blip.ring = sanitizeHtml(ring, restrictedOptions)
    blip.quadrant = sanitizeHtml(quadrant, restrictedOptions)

    return blip
  }

  return self
}

module.exports = InputSanitizer
