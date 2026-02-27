const express = require("express");
const router = express.Router();
const pool = require("../../db");

// ユーザー一覧取得
router.get("/", async (req, res) => {
  res.render("loginView");
});

module.exports = router;
