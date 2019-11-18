import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import _get from 'lodash/get'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import { auth } from '../../../firebase'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const useStyles = makeStyles({
  profileImage: {
    position: 'relative',
    overflow: 'hidden',
    '& img': {
      width: '100%',
    },
  },
})

const ProfileAvatar = () => {
  const classes = useStyles()
  const user = useSelector(state => state.auth.user)
  const [anchorEl, setAnchorEl] = useState(null)

  function logout() {
    auth.signOut().then(() => handleClose())
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Fab
        className={classes.profileImage}
        size='medium'
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        <img alt='photoURL' src={_get(user, 'providerData[0].photoURL')} />
      </Fab>

      <Popper open={Boolean(anchorEl)} placement='bottom-end' anchorEl={anchorEl} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

    </React.Fragment>
  )
}

export default ProfileAvatar
