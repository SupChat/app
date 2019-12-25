import React from 'react'
import Button from '@material-ui/core/Button'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'

export default function User() {
  const dispatch =useDispatch()

  const back = () => {
    dispatch(push('/'))
  }

  return (
    <div>
      <Button onClick={back}>Back</Button>
    </div>
  )
}