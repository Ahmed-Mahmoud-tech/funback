const express = require("express")
const router = express.Router()
const Game = require("../models/Game")

// Create a new game
router.post("/", async (req, res) => {
  try {
    const game = await Game.create(req.body)
    res.status(201).json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.findAll()
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a game by ID
router.put("/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    if (!game) return res.status(404).json({ error: "Game not found" })
    await game.update(req.body)
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a game by ID
router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    if (!game) return res.status(404).json({ error: "Game not found" })
    await game.destroy()
    res.json({ message: "Game deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
