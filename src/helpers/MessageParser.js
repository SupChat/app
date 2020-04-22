import { Emoji } from 'emoji-mart'
import _get from 'lodash/get'
import { emojiIndex } from 'emoji-mart'
import EmojiRegex from 'emoji-regex'
import _forEach from 'lodash/forEach'
const emojiRegex = EmojiRegex()
const emojiByNative = {}

_forEach(emojiIndex.emojis, (emoji) => {
  if (emoji['native']) {
    emojiByNative[emoji['native']] = emoji
  } else {
    _forEach(emoji, (emojiChild) => {
      emojiByNative[emojiChild['native']] = emojiChild
    })
  }
})

class MessageParser {
  static createEmojiImg({ emoji, size }) {
    const e = Emoji({
      html: true,
      set: 'google',
      emoji: emoji.colons,
      size: size || 24,
    }).replace(/span/g, 'img')

    const elem = document.createElement('div')
    elem.innerHTML = e
    elem.firstChild.setAttribute('alt', emoji.native)
    elem.firstChild.style.display = null
    elem.firstChild.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    return elem.innerHTML
  }

  static convertUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>')
  }

  static convertEmojiTextToHTML(text) {
    let comp = text
    let match
    let index = 0

    while (Boolean(match = emojiRegex.exec(comp))) {
      const emojiNative = match[0]
      const emojiLength = emojiNative.length

      const emoji = _get(emojiByNative, `${emojiNative}`)
      if (emoji && match.index >= index) {
        const replaceStr = comp.substr(0, match.index) + this.createEmojiImg({ emoji })
        comp = replaceStr + comp.substr(match.index + emojiLength)
        index = replaceStr.length
      }
    }
    return comp
  }

}

export default MessageParser