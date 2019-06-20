import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles({
  root: {
    marginTop: 20,
  }
})

const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>Logged in to CHAT.</div>
  )
}

export default Home
