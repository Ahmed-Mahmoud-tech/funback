const express = require("express")
const router = express.Router()
const Section = require("../models/Section")

// Create a new section
router.post("/", async (req, res) => {
  try {
    const section = await Section.create(req.body)
    res.status(201).json(section)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all sections
router.get("/", async (req, res) => {
  try {
    const sections = await Section.findAll()
    res.json(sections)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get a section by ID
router.get("/:id", async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id)
    if (!section) return res.status(404).json({ error: "Section not found" })
    res.json(section)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a section by ID
router.put("/:id", async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id)
    if (!section) return res.status(404).json({ error: "Section not found" })
    await section.update(req.body)
    res.json(section)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a section by ID
router.delete("/:id", async (req, res) => {
  try {
    const section = await Section.findByPk(req.params.id)
    if (!section) return res.status(404).json({ error: "Section not found" })
    await section.destroy()
    res.json({ message: "Section deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
