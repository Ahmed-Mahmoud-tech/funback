const PushToken = require("../models/PushToken");
const Expo = require("expo-server-sdk").Expo;
const expo = new Expo();

// Function to send push notifications
const sendPushNotification = async ({ title, body }) => {
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
        console.log(chunk, "0000000000066668888888888");

        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        throw new Error(error, "Error sending push notification");
        console.error("Error sending push notification:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching tokens from database:", error);
  }
};

module.exports = {
  sendPushNotification,
};
