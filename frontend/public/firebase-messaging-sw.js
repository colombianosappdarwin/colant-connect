importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB2IVEoBqnPMEtF0JMfuiEcCW0JFcMzs6g",
  authDomain: "colant-connect.firebaseapp.com",
  projectId: "colant-connect",
  storageBucket: "colant-connect.firebasestorage.app",
  messagingSenderId: "713772860555",
  appId: "1:713772860555:web:da025b8f568dea94db008e",
  measurementId: "G-D085TW2CHK"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "COLANT Connect";

  const notificationOptions = {
    body: payload.notification?.body || "Nueva notificación disponible.",
    icon: "/favicon.ico"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});