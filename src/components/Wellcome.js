import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

class Wellcome extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { user, push } = this.props
    if (prevProps.user !== user) {
      if (user) {
        push('/')
      }
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        Wellcome to CHAT.
      </div>
    )
  }

}

const styles = {
  root: {
    marginTop: 20
  }
}

const mapStateToProps = (store) => ({
  user: store.auth.user,
})

const mapDispatchToProps = {
  push,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Wellcome))
