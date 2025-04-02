const express = require("express")
const router = express.Router()
const Reservation = require("../models/Reservation")

// Create a reservation
router.post("/", async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body)
    res.status(201).json(reservation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.findAll()
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a reservation
router.put("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" })
    await reservation.update(req.body)
    res.json(reservation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a reservation
router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id)
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" })
    await reservation.destroy()
    res.json({ message: "Reservation deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
