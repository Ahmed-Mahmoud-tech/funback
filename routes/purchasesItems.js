const express = require("express")
const router = express.Router()
const PurchasesItem = require("../models/PurchasesItems")

// Create a new purchase item
router.post("/", async (req, res) => {
  try {
    const item = await PurchasesItem.create(req.body)
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all purchase items
router.get("/", async (req, res) => {
  try {
    const items = await PurchasesItem.findAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get a purchase item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await PurchasesItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ error: "Item not found" })
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a purchase item by ID
router.put("/:id", async (req, res) => {
  try {
    const item = await PurchasesItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ error: "Item not found" })
    await item.update(req.body)
    res.json(item)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a purchase item by ID
router.delete("/:id", async (req, res) => {
  try {
    const item = await PurchasesItem.findByPk(req.params.id)
    if (!item) return res.status(404).json({ error: "Item not found" })
    await item.destroy()
    res.json({ message: "Item deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
