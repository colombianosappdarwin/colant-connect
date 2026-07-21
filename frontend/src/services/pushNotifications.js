import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

import { API_URL } from "../config";

let listenersConfigured = false;

export async function initializePushNotifications() {
  // Solo funciona dentro de la app Android/iOS instalada.
  if (!Capacitor.isNativePlatform()) {
    console.log(
      "Push notifications are disabled in the normal web browser."
    );
    return;
  }

  try {
    if (!listenersConfigured) {
      configurePushListeners();
      listenersConfigured = true;
    }

    const currentPermission =
      await PushNotifications.checkPermissions();

    let permissionStatus =
      currentPermission.receive;

    if (permissionStatus === "prompt") {
      const requestedPermission =
        await PushNotifications.requestPermissions();

      permissionStatus =
        requestedPermission.receive;
    }

    if (permissionStatus !== "granted") {
      console.warn(
        "Push notification permission was not granted."
      );
      return;
    }

    await PushNotifications.register();

    console.log(
      "Push notification registration requested."
    );
  } catch (error) {
    console.error(
      "Error initializing push notifications:",
      error
    );
  }
}

function configurePushListeners() {
  PushNotifications.addListener(
    "registration",
    async (token) => {
      console.log("FCM TOKEN:", token.value);

      const accessToken =
        localStorage.getItem("token");

      if (!accessToken) {
        console.warn(
          "The user is not authenticated. The FCM token was not saved."
        );
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/auth/save-fcm-token`,
          {
            fcm_token: token.value,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(
          "FCM token saved successfully:",
          response.data
        );
      } catch (error) {
        console.error(
          "Error saving FCM token:",
          error.response?.data ||
            error.message
        );
      }
    }
  );

  PushNotifications.addListener(
    "registrationError",
    (error) => {
      console.error(
        "Push notification registration error:",
        error
      );
    }
  );

  PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
      console.log(
        "Push notification received:",
        notification
      );
    }
  );

  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (action) => {
      console.log(
        "Push notification opened:",
        action.notification
      );
    }
  );
}