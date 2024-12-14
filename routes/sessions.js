const express = require("express")
const router = express.Router()
const Session = require("../models/Session")

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
    const sessions = await Session.findAll()
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
