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

router.get("/menuDetails/:meal", async (req, res) => {
  try {
    const date = req.query.date; // クエリパラメータから日付を取得
    const mealType = req.params.meal; // URLパラメータから食事の種類を取得（例: breakfast, lunch, dinner）

    // ✅ pool を直接使う（Promise版）
    const [meals] = await pool.query(
      "SELECT * FROM meal WHERE date = ? AND type = ?",
      [date, mealType],
    );

    res.render("mealDetailView", { meals: meals, mealDate: date });
  } catch (error) {
    console.error("エラー:", error);
    res.render("mealDetailView", {
      meals: [],
      error: "データを取得できませんでした",
    });
  }
});

module.exports = router;
