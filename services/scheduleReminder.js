const schedule = require("node-schedule");
const { sendPushNotification } = require("./expoNotification");

const scheduleReminder = (time, req) => {
  const job = schedule.scheduleJob(time, async () => {
    await sendPushNotification({
      title: "New Request",
      body: "data.body00000000000000000000",
    });
    req.app.get("io").emit(req.user.id, { message: "Session_end" });
  });
};

module.exports = { scheduleReminder };
