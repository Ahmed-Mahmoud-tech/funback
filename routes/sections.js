const express = require("express")
const router = express.Router()

const Section = require("../models/Section")
const { verifyToken } = require("../middleware/verifyToken")
// const { Op } = require("sequelize")

// Create a reservation
router.post("/", verifyToken, async (req, res) => {
  try {
    const section = await Section.create({ ...req.body, ownerId: req.user.id })
    res.status(201).json(section)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/", verifyToken, async (req, res) => {
  try {
    const sections = await Section.findAll({
      where: {
        ownerId: req.user.id,
        // status: {
        //   [Op.ne]: "blocked",
        // },
      },
    })

    res.json(sections)
  } catch (error) {
    console.error("Error fetching sections:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get a sections by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const sections = await Section.findByPk(req.params.id)
//     if (!sections) return res.status(404).json({ error: "Section not found" })
//     res.json(sections)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// Update a sections by ID
router.put("/:id", async (req, res) => {
  try {
    const sections = await Section.findByPk(req.params.id)
    if (!sections) return res.status(404).json({ error: "Section not found" })
    await sections.update(req.body)
    res.json(sections)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a sections by ID
router.delete("/:id", async (req, res) => {
  try {
    const sections = await Section.findByPk(req.params.id)
    if (!sections) return res.status(404).json({ error: "Section not found" })
    await sections.destroy()
    res.json({ message: "Section deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
