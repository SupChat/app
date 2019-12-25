import React, { useCallback, useState } from 'react'
import Fab from '@material-ui/core/Fab'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import _get from 'lodash/get'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import { auth } from '../../../firebase'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { push } from 'connected-react-router'

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
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const [anchorEl, setAnchorEl] = useState(null)
  const isDark = useSelector(store => store.ui.selectedTheme === 'themeDark')

  function logout() {
    auth.signOut().then(() => handleClose())
  }

  function handleClose() {
    setAnchorEl(null)
  }

  const onThemeChange = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' })
  }, [dispatch])

  const onClick = useCallback((e) => setAnchorEl(anchorEl ? null : e.currentTarget), [anchorEl])

  const handleGoProfile = useCallback(() => {
    setAnchorEl(null)
    dispatch(push('/user'))
  }, [dispatch])

  return (
    <React.Fragment>
      <Fab
        className={classes.profileImage}
        size='medium'
        onClick={onClick}>
        <img alt='photoURL' src={_get(user, 'providerData[0].photoURL')} />
      </Fab>

      <Popper open={Boolean(anchorEl)} placement='bottom-end' anchorEl={anchorEl} role={undefined} transition
              disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem>
                    <FormControlLabel
                      control={<Switch color="primary" value={isDark} onChange={onThemeChange} />}
                      label="Dark"
                    />
                  </MenuItem>
                  <MenuItem onClick={handleGoProfile}>Profile</MenuItem>
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
