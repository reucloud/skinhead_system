const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/", (req, res) => {
  res.render("loginView", {
    error: "",
  });
});

// ユーザー一覧取得
router.post("/", async (req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  try {
    // ✅ await で Promise を処理
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      mail,
    ]);

    // ✅ パスワードカラムは "pass"
    if (results.length > 0 && password === results[0].pass) {
      // ⚠️ 本来は bcrypt.compare() を使うべき

      // ✅ セッション設定（express-session導入後）
      // req.session.userId = results[0].id;

      // ✅ 存在するルートへリダイレクト
      return res.redirect("/login"); // または別の実装済みページ
    } else {
      return res.render("loginView", {
        error: "メールアドレスまたはパスワードが正しくありません",
      });
    }
  } catch (error) {
    console.error("ログインエラー:", error);
    return res.render("loginView", {
      error: "ログイン処理でエラーが発生しました",
    });
  }
});

module.exports = router;
