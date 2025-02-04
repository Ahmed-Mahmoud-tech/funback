const express = require("express");
const router = express.Router();
const PurchasesItem = require("../models/PurchasesItems");
const { verifyToken } = require("../middleware/verifyToken");
const User = require("../models/User");
const { addRequest } = require("../services/notificationService");

// Create a new purchase item
router.post("/", verifyToken, async (req, res) => {
  try {
    const item = await PurchasesItem.create(req.body);

    if (req.body.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.body.ownerId);

      if (owner.purchasesItems == true) {
        await addRequest(req, res, {
          notification_type: "purchasesItems",
          from_user: req.user.id,
          to_user: req.body.ownerId,
          body: {
            author: req.body.username,
            type: "newPurchaseItem",
            name: item.name,
            price: item.price,
            time: new Date().toISOString(),
          },
        });
      }
    }

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all purchase items
router.get("/", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const items = await PurchasesItem.findAll({
      where: {
        ownerId: req.user.owner,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a purchase item by ID

// router.get("/:id", async (req, res) => {
//   try {
//     const item = await PurchasesItem.findByPk(req.params.id)
//     if (!item) return res.status(404).json({ error: "Item not found" })
//     res.json(item)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

// Update a purchase item by ID

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const item = await PurchasesItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (req.body.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.body.ownerId);

      if (owner.purchasesItems == true) {
        await addRequest(req, res, {
          notification_type: "purchasesItems",
          from_user: req.user.id,
          to_user: req.body.ownerId,
          body: {
            author: req.body.username,
            type: "updatePurchaseItem",
            name: item.name,
            newName: req.body.name,
            price: item.price,
            time: new Date().toISOString(),
          },
        });
      }
    }

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a purchase item by ID
router.delete("/", verifyToken, async (req, res) => {
  try {
    const item = await PurchasesItem.findByPk(req.query.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (req.query.isFromEmployee === "employee") {
      const owner = await User.findByPk(req.query.ownerId);

      if (owner.purchasesItems == true) {
        await addRequest(req, res, {
          notification_type: "purchasesItems",
          from_user: req.user.id,
          to_user: req.query.ownerId,
          body: {
            author: req.query.username,
            type: "deletePurchaseItem",
            name: item.name,
            price: item.price,
            time: new Date().toISOString(),
          },
        });
      }
    }

    await item.destroy();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
