const express = require("express")
const router = express.Router()
const Session = require("../models/Session")
const { Op } = require("sequelize")

// Create a new session
router.post("/", async (req, res) => {
  try {
    const session = await Session.create(req.body)
    res.status(201).json(session)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const { playerId, startDate, sessionType, status } = req.query
    console.log({ playerId, startDate, sessionType, status })

    const whereClause = {}
    if (playerId) {
      whereClause.playerId = playerId // Exact match
    }
    if (status) {
      whereClause.status = status // Exact match
    }
    if (sessionType) {
      whereClause.type = sessionType // Exact match
    }
    if (startDate) {
      const date = new Date(parseInt(startDate))
      if (!isNaN(date.getTime())) {
        // Check for valid date
        // convert server to local
        whereClause.startTime = {
          [Op.gte]: date, // Start of the day
          [Op.lt]: new Date(parseInt(startDate) + 24 * 60 * 60 * 1000), // Start of the next day
        }
      } else {
        return res
          .status(400)
          .json({ error: "Invalid date format for start date" })
      }
    }

    // const sessions = await Session.findAll()
    const sessions = await Session.findAll({ where: whereClause })
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a session
router.put("/:id", async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id)
    if (!session) return res.status(404).json({ error: "Session not found" })
    await session.update(req.body)
    res.json(session)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a session
router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id)
    if (!session) return res.status(404).json({ error: "Session not found" })
    await session.destroy()
    res.json({ message: "Session deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
