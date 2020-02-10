import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { auth, database, firestore, messaging } from '../firebase'
import * as firebase from 'firebase/app'
import { setUser } from '../state/actions/auth'
import _get from 'lodash/get';

export default function Auth({ children }) {
  const dispatch = useDispatch()
  const currentUserId = useSelector(store => _get(store, 'auth.user.uid'))

  useEffect(() => {
    function handleTokenRefresh() {
      return messaging.getToken()
        .then((token) => {
          return firestore.collection('users')
            .doc(auth.currentUser.uid)
            .set({ token }, { merge: true })
        })
    }

    async function onAuthStateChanged(user) {
      if (user) {
        const { uid: id, displayName, photoURL, email, phoneNumber } = user
        await firestore
          .collection('users')
          .doc(user.uid)
          .set({
            id,
            displayName: displayName || email,
            photoURL,
            email,
            phoneNumber,
            lastLogin: new Date(),
          }, { merge: true })

        const userStatusDatabaseRef = database.ref('/status/' + id);

        database.ref('.info/connected').off();

        database.ref('.info/connected').on('value', async (snapshot) => {
          if (snapshot.val()) {
            userStatusDatabaseRef.onDisconnect().set( { state: 'offline', last_changed: firebase.database.ServerValue.TIMESTAMP }).then(() => {
              userStatusDatabaseRef.set({ state: 'online', last_changed: firebase.database.ServerValue.TIMESTAMP })
            })
          }
        })
        Notification.requestPermission().then(handleTokenRefresh)
        messaging.onTokenRefresh(handleTokenRefresh)
      } else if (currentUserId) {
        await database.ref(`/status/${currentUserId}`).set({ state: 'offline', last_changed: firebase.database.ServerValue.TIMESTAMP });
      }
      dispatch(setUser(user))
    }

    return auth.onAuthStateChanged(onAuthStateChanged)
  }, [ dispatch, currentUserId ])

  return children
}
