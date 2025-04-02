const schedule = require("node-schedule");

const scheduleReminder = (time, req) => {
  const job = schedule.scheduleJob(time, async () => {
    req.app.get("io").emit(req.user.id, { message: "Session_end" });
  });
};

module.exports = { scheduleReminder };
