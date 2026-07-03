import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB2IVeOBqnPMEtF0JMfuiEcCW0JMfuiEcCW0JFcMzs6g",
  authDomain: "colant-connect.firebaseapp.com",
  projectId: "colant-connect",
  storageBucket: "colant-connect.firebasestorage.app",
  messagingSenderId: "713772860555",
  appId: "1:713772860555:web:da025b8f568dea94db008e",
  measurementId: "G-D085TW2CHK"
};

const app = initializeApp(firebaseConfig);

export async function requestNotificationPermission() {
  const supported = await isSupported();

  if (!supported) {
    console.log("Firebase Messaging no es compatible.");
    return null;
  }

  const messaging = getMessaging(app);

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey:
      "BO5rLI7-_DTHo3_eWQ17jpppP0f9NKaItXx-WqJq8FS3GXbzsg8-asSmfBMgPY5_hQa0NOfTOeyk4oh3kPFMffM"
  });

  console.log("FCM TOKEN:", token);

  return token;
}