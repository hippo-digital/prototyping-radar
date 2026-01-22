jest.mock('d3', () => {
  class Selection {
    constructor(node) {
      this._node = node || null
    }

    empty() {
      return !this._node
    }

    node() {
      return this._node
    }

    remove() {
      if (this._node && this._node.remove) {
        this._node.remove()
      }
      return this
    }

    append(tagName) {
      if (!this._node) return new Selection(null)
      const el = globalThis.document.createElement(tagName)
      this._node.appendChild(el)
      return new Selection(el)
    }

    insert(tagName, beforeSelector) {
      if (!this._node) return new Selection(null)
      const el = globalThis.document.createElement(tagName)
      const before = beforeSelector ? this._node.querySelector(beforeSelector) : null
      if (before && before.parentNode === this._node) {
        this._node.insertBefore(el, before)
      } else {
        this._node.insertBefore(el, this._node.firstChild)
      }
      return new Selection(el)
    }

    attr(name, value) {
      if (this._node && this._node.setAttribute) {
        this._node.setAttribute(name, value)
      }
      return this
    }

    classed(className, value) {
      if (this._node && this._node.classList) {
        this._node.classList.toggle(className, Boolean(value))
      }
      return this
    }

    text(value) {
      if (this._node) {
        this._node.textContent = value
      }
      return this
    }

    html(value) {
      if (this._node) {
        this._node.innerHTML = value
      }
      return this
    }

    on(eventName, handler) {
      if (this._node && this._node.addEventListener) {
        this._node.addEventListener(eventName, handler)
      }
      return this
    }

    select(selector) {
      if (!this._node || !this._node.querySelector) return new Selection(null)
      return new Selection(this._node.querySelector(selector))
    }
  }

  const select = (selector) => new Selection(globalThis.document.querySelector(selector))
  const selectAll = (selector) => {
    const nodes = Array.from(globalThis.document.querySelectorAll(selector))
    return {
      remove: () => nodes.forEach((n) => n.remove()),
    }
  }

  return { select, selectAll }
})

const { initializeToggle } = require('../../src/util/listView')

describe('List view toggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main><div id="radar"></div></main>'
  })

  it('should create and show the list view when toggled on', () => {
    const radar = {
      quadrants: () => [],
    }

    initializeToggle(radar)

    const button = document.querySelector('.view-toggle__button')
    expect(button).not.toBeNull()

    button.click()

    expect(document.body.classList.contains('list-view-active')).toBe(true)

    const listView = document.querySelector('#list-view')
    expect(listView).not.toBeNull()
    expect(listView.classList.contains('active')).toBe(true)
  })
})
