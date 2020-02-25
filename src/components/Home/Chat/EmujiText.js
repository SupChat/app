import React from 'react'
import { Emoji, emojiIndex } from 'emoji-mart'
import makeStyles from '@material-ui/core/styles/makeStyles'
import EmojiRegex from 'emoji-regex'
import _forEach from 'lodash/forEach'
import _get from 'lodash/get'

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

const useStyles = makeStyles({
  select: {
    display: 'inherit',
    userSelect: 'text',
  },
})

export function createEmojiImg({ emoji, size }) {
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
  return elem.innerHTML
}

const convertUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, '<a href="$1">$1</a>')
}

export const convertEmojiTextToHTML = (text) => {
  let comp = text
  let match
  let index = 0

  while (Boolean(match = emojiRegex.exec(comp))) {
    const emojiNative = match[0]
    const emojiLength = emojiNative.length

    const emoji = _get(emojiByNative, `${emojiNative}`)
    if (emoji && match.index >= index) {
      const replaceStr = comp.substr(0, match.index) + createEmojiImg({ emoji })
      comp = replaceStr + comp.substr(match.index + emojiLength)
      index = replaceStr.length
    }
  }
  return comp
}

export function textToHtml(text) {
  return convertEmojiTextToHTML(convertUrls(text));
}

export default function EmojiText({ text }) {
  const classes = useStyles()

  return (
    <div
      className={classes.select}
      dangerouslySetInnerHTML={{ __html: textToHtml(text) }} />
  )
}
