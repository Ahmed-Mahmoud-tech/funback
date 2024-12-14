const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")

// Create a notification
router.post("/", async (req, res) => {
  try {
    const message = await Notification.create(req.body)
    res.status(201).json(message)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all notification messages
router.get("/", async (req, res) => {
  try {
    const messages = await Notification.findAll()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete a notification message
router.delete("/:id", async (req, res) => {
  try {
    const message = await Notification.findByPk(req.params.id)
    if (!message) return res.status(404).json({ error: "Message not found" })
    await message.destroy()
    res.json({ message: "Message deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
