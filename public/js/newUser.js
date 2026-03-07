const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/", (req, res) => {
  res.render("newUserView", {
    // error: "",
  });
});

// ユーザー一覧取得
router.post("/", async (req, res) => {
  const { email, password, height, weight, gender, birthday } = req.body;

  try {
    // ✅ メール重複チェック
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // ✅ 重複があればエラー表示
    if (results.length > 0) {
      return res.render("newUserView", {
        error: "このメールアドレスは既に使用されています",
      });
    }

    // ✅ ユーザー登録（全ての必須項目を含む）
    const [newUser] = await pool.query(
      "INSERT INTO users (email, pass, height, weight, gender, birthday) VALUES (?, ?, ?, ?, ?, ?)",
      [email, password, height, weight, gender, birthday],
    );

    // ✅ ログインページへリダイレクト
    return res.redirect("/login");
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return res.render("newUserView", {
      error: "ユーザー登録処理でエラーが発生しました",
    });
  }
});

module.exports = router;
