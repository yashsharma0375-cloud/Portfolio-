const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact — store a message sent from the portfolio's contact form
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are all required" });
  }

  try {
    const saved = await ContactMessage.create({ name, email, message });
    res.status(201).json({ received: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET /api/contact — list messages (for your own use; add auth before deploying publicly)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
