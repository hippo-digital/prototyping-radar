const { graphConfig } = require('../graphing/config')
const IDEAL_BLIP_WIDTH = 22
const Blip = function (name, ring, isNew, status, topic, description, order) {
  let self, blipText, isGroup, id, groupIdInGraph, filename

  self = {}
  isGroup = false

  self.width = IDEAL_BLIP_WIDTH

  self.name = function () {
    return name
  }

  self.id = function () {
    return id || -1
  }

  self.groupBlipWidth = function () {
    return isNew ? graphConfig.newGroupBlipWidth : graphConfig.existingGroupBlipWidth
  }

  self.topic = function () {
    return topic || ''
  }

  self.description = function () {
    return description || ''
  }

  self.order = function () {
    return order !== undefined && order !== null ? order : null
  }

  self.isNew = function () {
    switch (self.status()) {
      case "new":
      case "":
        return true
      default:
        return false
    }
  }

  self.hasMovedIn = function () {
    switch (self.status()) {
      case "moved in":
      case "grow":
        return true
      default:
        return false
    }
  }

  self.hasMovedOut = function () {
    switch (self.status()) {
      case "moved out":
      case "wither":
        return true
      default:
        return false
    }
  }

  self.hasNoChange = function () {
    switch (self.status()) {
      case "no change":
      case "hold":
        return true
      default:
        return false
    }
  }

  self.status = function () {
    return status.toLowerCase() || ''
  }

  self.isGroup = function () {
    return isGroup
  }

  self.groupIdInGraph = function () {
    return groupIdInGraph || ''
  }

  self.setGroupIdInGraph = function (groupId) {
    groupIdInGraph = groupId
  }

  self.ring = function () {
    return ring
  }

  self.blipText = function () {
    return blipText || ''
  }

  self.setBlipText = function (newBlipText) {
    blipText = newBlipText
  }

  self.setId = function (newId) {
    id = newId
  }

  self.setIsGroup = function (isAGroupBlip) {
    isGroup = isAGroupBlip
  }

  self.filename = function () {
    return filename || ''
  }

  self.setFilename = function (newFilename) {
    filename = newFilename
  }

  return self
}

module.exports = Blip
