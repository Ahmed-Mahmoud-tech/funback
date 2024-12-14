const express = require("express")
const router = express.Router()
const PlayersPurchase = require("../models/PlayersPurchases")

// Create a new player's purchase
router.post("/", async (req, res) => {
  try {
    const purchase = await PlayersPurchase.create(req.body)
    res.status(201).json(purchase)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all player's purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await PlayersPurchase.findAll()
    res.json(purchases)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a player's purchase status
router.put("/:id", async (req, res) => {
  try {
    const purchase = await PlayersPurchase.findByPk(req.params.id)
    if (!purchase) return res.status(404).json({ error: "Purchase not found" })
    await purchase.update(req.body)
    res.json(purchase)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a player's purchase
router.delete("/:id", async (req, res) => {
  try {
    const purchase = await PlayersPurchase.findByPk(req.params.id)
    if (!purchase) return res.status(404).json({ error: "Purchase not found" })
    await purchase.destroy()
    res.json({ message: "Purchase deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
