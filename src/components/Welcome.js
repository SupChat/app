import React, { useEffect } from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'

export default function Welcome() {
  function useStyles() {
   return  makeStyles({
      root: {
        marginTop: 20
      }
    })
  }

  const classes = useStyles()
  const dispatch = useDispatch()
  const currentUser = useSelector((store) => store.auth.user)

  useEffect(() => {
    if (currentUser) {
      dispatch(push('/'))
    }
  }, [currentUser, dispatch])

  return (
    <div className={classes.root}>
      Welcome to CHAT.
    </div>
  )
}
