const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get the count of all unread notification messages
router.get("/count/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const count = await Notification.count({
      where: { is_read: false, to_user: userId },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notification messages
router.get("/:id", async (req, res) => {
  try {
    const messages = await Notification.findAll({
      where: { to_user: req.params.id },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a notification message
router.delete("/:id", async (req, res) => {
  try {
    const message = await Notification.findByPk(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    await message.destroy();
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
