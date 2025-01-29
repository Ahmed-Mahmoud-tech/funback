const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { Op } = require("sequelize");

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
  const startDate = req.query.startDate;

  try {
    const messages = await Notification.findAll({
      where: {
        to_user: req.params.id,
        createdAt: {
          [Op.gte]: new Date(parseInt(startDate)), // Start of the day
          [Op.lt]: new Date(parseInt(startDate) + 24 * 60 * 60 * 1000), // Start of the next day
        },
      },
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update multiple notifications to mark them as read
router.put("/", async (req, res) => {
  const { ids } = req.body;
  try {
    await Notification.update(
      { is_read: true },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );
    res.json({ message: "Notifications marked as read successfully" });
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
