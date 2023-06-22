/** blockScroll.js ************************************************************************************************** */
let blockScroll = null
let blockScrollEvent = null

Object.assign(Window.prototype, {
  blockScroll(method = 'block') {
    if (!method) method = 'scroll'
    blockScroll = blockScroll || new BlockScroll('block-scroll')
    return blockScroll[method]()
  },
  blockScrollEvent (method = 'block') {
    if (!method) method = 'scroll'
    blockScrollEvent = blockScrollEvent || new BlockScroll('block-scroll-event')
    return blockScrollEvent[method]()
  }
})

class BlockScroll {
  constructor (event) {
    this.eventType = event
    this.isBlock = false
  }

  block () {
    if (this.isBlock) return this.isBlock

    this.isBlock = true
    document.body.classList.add(this.eventType)
    if (this.eventType === 'block-scroll-event') {
      document.body.addEventListener('wheel', this.blockScrollEventHandler, {passive: false})
      document.body.addEventListener('touchmove', this.blockScrollEventHandler, {passive: false})
    }

    return this.isBlock
  }

  scroll () {
    if (!this.isBlock) return this.isBlock

    this.isBlock = false
    document.body.classList.remove(this.eventType)
    if (this.eventType === 'block-scroll-event') {
      document.body.removeEventListener('wheel', this.blockScrollEventHandler)
      document.body.removeEventListener('touchmove', this.blockScrollEventHandler)
    }

    return this.isBlock
  }

  blockScrollEventHandler (e) {
    e.preventDefault()
  }
}
/** ***************************************************************************************************************** */
