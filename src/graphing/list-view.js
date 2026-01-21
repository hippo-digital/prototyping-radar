const d3 = require('d3')

const ListView = function (size, radar) {
  var svg, radarElement

  svg = d3.select('svg#radar')
  radarElement = svg.append('g').attr('id', 'list-view').style('display', 'none')

  return self
}

module.exports = ListView
