import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyCQnhVZsPO6rvbUqnQ0nZTFEvHUzfdl7rw',
  authDomain: 'react-firestore-chat.firebaseapp.com',
  databaseURL: 'https://react-firestore-chat.firebaseio.com',
  projectId: 'react-firestore-chat',
  storageBucket: 'react-firestore-chat.appspot.com',
  messagingSenderId: '1086875523414',
  appId: '1:1086875523414:web:a048b5c8f1b39c81',
}

const fire = firebase.initializeApp(firebaseConfig)

export const firestore = fire.firestore()
export const database = fire.database()

export const auth = fire.auth()
export const storage = fire.storage()
export const messaging = fire.messaging()
export const api = 'https://us-central1-react-firestore-chat.cloudfunctions.net/api'
