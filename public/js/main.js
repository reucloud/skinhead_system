const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/", (req, res) => {
  res.render("mainView");
});

// ユーザー一覧取得
router.post("/", async (req, res) => {
  res.redirect("/main");
});

module.exports = router;
