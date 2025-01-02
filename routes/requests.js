const express = require("express")
const router = express.Router()

const User = require("../models/User")
const Request = require("../models/Request")
const { verifyToken } = require("../middleware/verifyToken")
const { Op } = require("sequelize")
const { createToken } = require("../lib/Common")

router.post("/", async (req, res) => {
  try {
    // Find the employee by phone number
    const employee = await User.findOne({
      where: { phoneNumber: req.body.phone, type: "employee" },
    })

    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee not found with the provided phone number" })
    }

    // Check if a request already exists
    const existingRequest = await Request.findOne({
      where: {
        fromUser: req.body.userId,
        toUser: employee.id,
      },
    })

    if (existingRequest) {
      if (existingRequest.status === "rejected") {
        // Update the status to "pending"
        existingRequest.status = "pending"
        await existingRequest.save()

        return res.status(200).json({
          message: "Request status updated to pending.",
          request: {
            id: existingRequest.id,
            status: existingRequest.status,
            updatedAt: existingRequest.updatedAt,
            toUserInfo: {
              username: employee.username,
              phoneNumber: employee.phoneNumber,
            },
          },
        })
      } else {
        // Return an error for existing requests with other statuses
        return res.status(400).json({
          error: "This employee has already been requested.",
        })
      }
    }

    // Create a new request if no existing request is found
    const request = await Request.create({
      fromUser: req.body.userId,
      toUser: employee.id,
      status: "pending",
    })

    const result = {
      status: request.dataValues.status,
      id: request.dataValues.id,
      updatedAt: request.dataValues.updatedAt,
      toUserInfo: {
        username: employee.username,
        phoneNumber: employee.phoneNumber,
      },
    }

    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/owner/", verifyToken, async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: {
        fromUser: req.user.id,
      },
      include: [
        {
          model: User,
          as: "toUserInfo",
          attributes: ["id", "username", "phoneNumber"],
        },
      ],
    })

    res.json(requests)
  } catch (error) {
    console.error("Error fetching requests:", error)
    res.status(500).json({ error: error.message })
  }
})

router.get("/employee/", verifyToken, async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: {
        toUser: req.user.id,
        status: {
          // [Op.ne]: "pending",
          [Op.or]: ["accepted", "pending"],
        },
      },
      include: [
        {
          model: User,
          as: "fromUserInfo",
          attributes: ["id", "username", "phoneNumber"],
        },
      ],
    })

    res.json(requests)
  } catch (error) {
    console.error("Error fetching requests:", error)
    res.status(500).json({ error: error.message })
  }
})

// Get a requests by ID
router.get("/:id", async (req, res) => {
  try {
    const requests = await Request.findByPk(req.params.id)
    if (!requests) return res.status(404).json({ error: "Request not found" })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a requests by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const requests = await Request.findByPk(req.params.id)
    if (!requests) return res.status(404).json({ error: "Request not found" })
    await requests.update(req.body)
    console.log(req.body.fromUser, "444444444444444444444444444444444")
    let token
    if (req.body.status == "accepted") {
      token = createToken(
        res,
        req.user.id,
        req.user.type || null,
        req.body.fromUser
      )
    }
    res.json({ ...requests.defaultValue, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a requests by ID
router.delete("/:id", async (req, res) => {
  try {
    const requests = await Request.findByPk(req.params.id)
    if (!requests) return res.status(404).json({ error: "Request not found" })
    await requests.destroy()
    res.json({ message: "Request deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
