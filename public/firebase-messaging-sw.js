importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

const config = { messagingSenderId: '1086875523414' }

firebase.initializeApp(config)

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  return self.registration.showNotification()
})
