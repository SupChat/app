import React, { useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import _get from 'lodash/get'

const useStyles = makeStyles({
  profileImage: {
    marginLeft: 'auto',
    overflow: 'hidden',
    '& img': {
      width: '100%',
    }
  },
})

const Profile = () => {
  const classes = useStyles()
  const user = useSelector(state => state.auth.user)
  const [anchorEl, setAnchorEl] = useState(null)

  // function logout() {
  //   auth.signOut().then(() => handleClose())
  // }

  // function handleClose() {
  //   setAnchorEl(null)
  // }

  return (
    <React.Fragment>
      <Fab
        className={classes.profileImage}
        size='medium'
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        <img alt='photoURL' src={_get(user, 'providerData[0].photoURL')} />
      </Fab>

      {/*<Popper open={Boolean(anchorEl)} anchorEl={anchorEl} keepMounted transition disablePortal>*/}
      {/*{*/}
      {/*({ TransitionProps, placement }) => (*/}
      {/*<Grow*/}
      {/*{...TransitionProps}*/}
      {/*style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}*/}
      {/*>*/}
      {/*<Paper id="menu-list-grow">*/}
      {/*<ClickAwayListener onClickAway={handleClose}>*/}
      {/*<MenuList>*/}
      {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
      {/*<MenuItem onClick={handleClose}>My account</MenuItem>*/}
      {/*<MenuItem onClick={logout}>Logout</MenuItem>*/}
      {/*</MenuList>*/}
      {/*</ClickAwayListener>*/}
      {/*</Paper>*/}
      {/*</Grow>*/}
      {/*)*/}
      {/*}*/}
      {/*</Popper>*/}


    </React.Fragment>
  )
}

export default Profile
