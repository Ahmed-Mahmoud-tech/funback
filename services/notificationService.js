const Notification = require("../models/Notification");

const addRequest = async (req, res, data) => {
  try {
    const message = await Notification.create({
      notification_type: data.notification_type,
      from_user: data.from_user,
      to_user: data.to_user,
      body: data.body,
    });

    req.app.get("io").emit(data.to_user, data);
    sendPushNotification({ title: "New Request", body: data.body });
  } catch (error) {
    console.log({ error: error.message });
    // res.status(400).json({ error: error.message });
  }
};

module.exports = { addRequest };
