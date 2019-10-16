import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { auth, db, messaging } from './firebase'
import { setUser } from './state/actions/auth'

export function Auth({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    function handleTokenRefresh() {
      return messaging.getToken()
        .then((token) => {
          console.log('token', token)
          return db.collection('users')
            .doc(auth.currentUser.uid)
            .set({ token }, { merge: true })
        })
    }

    async function onAuthStateChanged(user) {
      if (user) {
        const { uid: id, displayName, photoURL, email, phoneNumber } = user
        await db
          .collection('users')
          .doc(user.uid)
          .set({
            id,
            displayName,
            photoURL,
            email,
            phoneNumber,
          })

        Notification.requestPermission().then(handleTokenRefresh)
        messaging.onTokenRefresh(handleTokenRefresh)

        messaging.onMessage((payload) => console.log('onMessage', payload))
      }

      dispatch(setUser(user))
    }

    auth.onAuthStateChanged(onAuthStateChanged)
  }, [dispatch])

  return children
}
