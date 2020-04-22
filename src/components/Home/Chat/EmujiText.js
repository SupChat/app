import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MessageParser from '../../../helpers/MessageParser'

const useStyles = makeStyles({
  select: {
    display: 'inherit',
    userSelect: 'text',
  },
})

export default function EmojiText({ text }) {
  const classes = useStyles()
  const __html = MessageParser.convertEmojiTextToHTML(MessageParser.convertUrls(text))

  return (
    <div
      className={classes.select}
      dangerouslySetInnerHTML={{ __html }} />
  )
}
