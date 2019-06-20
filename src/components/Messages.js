import React from 'react'
import {  db } from '../firebase'

class Messages extends React.Component {
  componentDidMount() {
    db.collection('messages').get().then((snapshot) => {
      console.log(snapshot.docs.map(doc => doc.data()))
    })
  }

  render() {
    return <div>
      Messages
    </div>
  }
}

export default Messages
