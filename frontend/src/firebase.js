import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB2IVEoBqnPMEtF0JMfuiEcCW0JFcMzs6g",
  authDomain: "colant-connect.firebaseapp.com",
  projectId: "colant-connect",
  storageBucket: "colant-connect.firebasestorage.app",
  messagingSenderId: "713772860555",
  appId: "1:713772860555:web:da025b8f568dea94db008e",
  measurementId: "G-D085TW2CHK"
};

const app = initializeApp(firebaseConfig);

export async function requestNotificationPermission() {
  try {
    const supported = await isSupported();

    console.log("Firebase supported:", supported);

    if (!supported) {
      console.log("Firebase Messaging no es compatible.");
      return null;
    }

    const permission = await Notification.requestPermission();

    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.log("El usuario rechazó las notificaciones.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    console.log("Service Worker registered:", registration);

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey:
        "BO5rLI7-_DTHo3_eWQ17jpppP0f9NKaItXx-WqJq8FS3GXbzsg8-asSmfBMgPY5_hQa0NOfTOeyk4oh3kPFMffM",
      serviceWorkerRegistration: registration
    });

    console.log("==================================");
    console.log("FCM TOKEN:", token);
    console.log("==================================");

    return token;
  } catch (error) {
    console.log("==================================");
    console.log("FIREBASE TOKEN ERROR");
    console.log("==================================");

    console.log(error);

    console.log("Name:", error?.name);
    console.log("Code:", error?.code);
    console.log("Message:", error?.message);
    console.log("Stack:", error?.stack);

    console.log("JSON:", JSON.stringify(error));

    console.log("==================================");

    return null;
  }
}