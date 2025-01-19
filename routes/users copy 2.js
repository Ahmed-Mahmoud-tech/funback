const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/verifyToken");
const { createToken } = require("../lib/Common");
const Request = require("../models/Request");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get("/:id", verifyToken, async (req, res) => {
  // update token in front and back
  try {
    const user = await User.findByPk(req.params.id);
    let owner;
    let token;
    if (
      req.params.id == req.user.id &&
      !["owner", "employee"].includes(req.user.type)
    ) {
      token = createToken(res, req.user.id, user?.dataValues?.type);
    } else {
      if (req.user.type == "employee") {
        const request = await Request.findOne({
          where: { toUser: req.user.id, status: "accepted" },
          attributes: ["fromUser"],
        });
        owner = request?.dataValues?.fromUser;
      } else {
        owner = req.user.id;
      }
      token = createToken(res, req.user.id, user?.dataValues?.type, owner);
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ ...user?.dataValues, owner, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log(req.body);
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
