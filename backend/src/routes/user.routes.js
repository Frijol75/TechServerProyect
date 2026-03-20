    const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get users" });
});

router.post("/", (req, res) => {
  res.json({ message: "Create user" });
});

module.exports = router;