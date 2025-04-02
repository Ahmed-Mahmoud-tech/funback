const PushToken = require("../models/PushToken");
const expo = new Expo();

// Function to send push notifications
export const sendPushNotification = async ({ title, body }) => {
  try {
    // Fetch all tokens from the database
    const tokens = await PushToken.findAll();

    const messages = tokens.map(({ token }) => ({
      to: token,
      sound: "default",
      title,
      body,
    }));

    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error("Error sending push notification:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching tokens from database:", error);
  }
};
