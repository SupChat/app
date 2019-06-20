import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { setUser } from '../actions/auth'

const Wellcome = ({ classes }) => {
  return (
    <div className={classes.root}>
      Wellcome to CHAT.
    </div>
  )
}

const styles = {
  root: {
    marginTop: 20
  },
  social: {}
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
})

const mapDispatchToProps = {
  push,
  setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Wellcome))
