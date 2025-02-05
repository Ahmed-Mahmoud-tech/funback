const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const { Op } = require("sequelize");
const { addRequest } = require("../services/notificationService");
const User = require("../models/User");
const { verifyToken } = require("../middleware/verifyToken");
const Section = require("../models/Section");
const { scheduleReminder } = require("../services/scheduleReminder");

// Create a new session
router.post("/", verifyToken, async (req, res) => {
  try {
    const session = await Session.create(req.body);

    if (req.body.endTime) {
      scheduleReminder(new Date(req.body.endTime), req);
    }

    if (req.body.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.body.ownerId);
      if (owner.session == true) {
        const section = await Section.findByPk(req.body.sectionId);

        await addRequest(req, res, {
          notification_type: "sessions",
          from_user: req.user.id,
          to_user: req.body.ownerId,
          body: {
            author: req.body.username,
            type: "newSession",
            section: section.sectionName,
            time: new Date().toISOString(),
          },
        });
      }
    }
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const { playerId, startDate, sessionType, status } = req.query;

    const whereClause = {};
    if (playerId) {
      whereClause.playerId = playerId; // Exact match
    }
    if (status) {
      whereClause.status = status; // Exact match
    }
    if (sessionType) {
      whereClause.type = sessionType; // Exact match
    }
    if (startDate) {
      const date = new Date(parseInt(startDate));
      if (!isNaN(date.getTime())) {
        // Check for valid date
        // convert server to local
        whereClause.startTime = {
          [Op.gte]: date, // Start of the day
          [Op.lt]: new Date(parseInt(startDate) + 24 * 60 * 60 * 1000), // Start of the next day
        };
      } else {
        return res
          .status(400)
          .json({ error: "Invalid date format for start date" });
      }
    }

    // const sessions = await Session.findAll()
    const sessions = await Session.findAll({ where: whereClause });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a session
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    if (req.body.endTime && req.body.endTime !== session.endTime) {
      scheduleReminder(new Date(req.body.endTime), req);
    }

    if (req.body.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.body.ownerId);

      if (owner.session == true) {
        if (req.body.status == "notPaid") {
          await addRequest(req, res, {
            notification_type: "sessions",
            from_user: req.user.id,
            to_user: req.body.ownerId,
            body: {
              author: req.body.username,
              type: "cancelSessionCheckout",
              time: new Date().toISOString(),
              section: req.body.sectionName,
              amount: req.body.amount,
              playerId: req.body.playerId,
            },
          });
        } else if (req.body.status == "paid") {
          await addRequest(req, res, {
            notification_type: "sessions",
            from_user: req.user.id,
            to_user: req.body.ownerId,
            body: {
              author: req.body.username,
              type: "sessionCheckout",
              time: new Date().toISOString(),
              section: req.body.sectionName,
              amount: req.body.amount,
              playerId: req.body.playerId,
            },
          });
        } else {
          await addRequest(req, res, {
            notification_type: "sessions",
            from_user: req.user.id,
            to_user: req.body.ownerId,
            body: {
              author: req.body.username,
              type: "updatedSession",
              section: req.body.sectionName,
              start: session.updatedAt,
              time: new Date().toISOString(),
            },
          });
        }
      }
    }

    await session.update(req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a session
router.delete("/", verifyToken, async (req, res) => {
  try {
    const session = await Session.findByPk(req.query.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    if (req.query.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.query.ownerId);
      if (owner.session == true) {
        await addRequest(req, res, {
          notification_type: "sessions",
          from_user: req.user.id,
          to_user: req.query.ownerId,
          body: {
            author: req.query.username,
            type: "deleteSession",
            section: req.query.sectionName,
            start: session.updatedAt,
            time: new Date().toISOString(),
          },
        });
      }
    }

    await session.destroy();
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
