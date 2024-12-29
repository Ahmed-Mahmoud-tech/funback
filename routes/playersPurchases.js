const express = require("express")
const router = express.Router()
const PlayersPurchase = require("../models/PlayersPurchases")
const Session = require("../models/Session")
const { Op } = require("sequelize")

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
// router.get("/", async (req, res) => {
//   try {
//     const purchases = await PlayersPurchase.findAll()
//     res.json(purchases)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

router.get("/", async (req, res) => {
  try {
    const { playerId, status, createdAt } = req.query

    // Build the filter conditions
    const whereClause = {}
    if (playerId) {
      whereClause.playerId = playerId // Exact match
    }
    if (status) {
      whereClause.status = status // Exact match
    }
    if (createdAt) {
      const date = new Date(parseInt(createdAt))
      if (!isNaN(date.getTime())) {
        // Check for valid date
        // convert server to local
        whereClause.createdAt = {
          [Op.gte]: date, // Start of the day
          [Op.lt]: new Date(parseInt(createdAt) + 24 * 60 * 60 * 1000), // Start of the next day
        }
      } else {
        return res
          .status(400)
          .json({ error: "Invalid date format for createdAt" })
      }
    }
    // Fetch purchases with filters
    const purchases = await PlayersPurchase.findAll({ where: whereClause })
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

router.get("/newPlayerId/:ownerId", async (req, res) => {
  try {
    // Calculate the start of the last 24 hours
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago

    // Fetch playerIds from players_purchase
    const purchasePlayerIds = await PlayersPurchase.findAll({
      where: {
        createdAt: {
          [Op.gte]: last24Hours,
        },
        ownerId: req.params.ownerId,
      },
      attributes: ["playerId"],
    })

    // Fetch playerIds from session
    const sessionPlayerIds = await Session.findAll({
      where: {
        endTime: {
          [Op.gte]: last24Hours,
        },
        ownerId: req.params.ownerId,
      },
      attributes: ["playerId"],
    })

    // Combine the results into a single array
    const allPlayerIds = [
      ...purchasePlayerIds.map((purchase) => purchase.playerId),
      ...sessionPlayerIds.map((session) => session.playerId),
    ]

    // Remove duplicates and sort in descending order
    const uniqueSortedPlayerIds = [...new Set(allPlayerIds)].sort(
      (a, b) => b - a
    )

    // Determine the new playerId
    const newPlayerId =
      uniqueSortedPlayerIds.length > 0
        ? Math.max(...uniqueSortedPlayerIds) + 1
        : 1

    // Add the new playerId to the top of the list
    const updatedPlayerIds = [newPlayerId, ...uniqueSortedPlayerIds]

    // Return the updated list
    res.status(200).json({
      success: true,
      playerIds: updatedPlayerIds,
    })
  } catch (error) {
    console.error("Error fetching player IDs:", error)
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching player IDs.",
    })
  }
})

module.exports = router
