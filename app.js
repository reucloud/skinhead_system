require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { exec } = require("child_process");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // フォームデータ解析用

const path = require("path");

// テンプレートエンジンの設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 静的ファイルの設定
app.use(express.static(path.join(__dirname, "public")));

// DB接続
const pool = require("./db");

// ルーターの読み込み
const loginRouter = require("./public/js/login");
const newUserRouter = require("./public/js/newUser");

app.use("/login", loginRouter);
app.use("/newUser", newUserRouter);

// 接続テスト
app.get("/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ message: "接続成功！", result: rows[0].result });
  } catch (err) {
    res.status(500).json({ message: "接続失敗", error: err.message });
  }
});

// ユーザー登録
app.post("/users", async (req, res) => {
  try {
    const { email, pass, height, weight, gender, birthday } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (email, pass, height, weight, gender, birthday) VALUES (?, ?, ?, ?, ?, ?)",
      [email, pass, height, weight, gender, birthday],
    );
    res.json({ message: "ユーザー登録成功", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "ユーザー登録失敗", error: err.message });
  }
});

// ユーザー一覧取得
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "取得失敗", error: err.message });
  }
});

// 食事登録
app.post("/meal", async (req, res) => {
  try {
    const {
      user_id,
      date,
      type,
      calorie,
      dish_name,
      carbohydrate,
      fat,
      protein,
    } = req.body;
    const [result] = await pool.query(
      "INSERT INTO meal (user_id, date, type, calorie, dish_name, carbohydrate, fat, protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        date,
        type,
        calorie,
        dish_name,
        carbohydrate || null,
        fat || null,
        protein || null,
      ],
    );
    res.json({ message: "食事登録成功", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "食事登録失敗", error: err.message });
  }
});

// 食事一覧取得
app.get("/meal", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meal");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "取得失敗", error: err.message });
  }
});

// 体重登録
app.post("/weight_graph", async (req, res) => {
  try {
    const { user_id, date, weight } = req.body;
    const [result] = await pool.query(
      "INSERT INTO weight_graph (user_id, date, weight) VALUES (?, ?, ?)",
      [user_id, date, weight],
    );
    res.json({ message: "体重登録成功", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "体重登録失敗", error: err.message });
  }
});

// 体重一覧取得
app.get("/weight_graph", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM weight_graph");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "取得失敗", error: err.message });
  }
});

// テストデータ投入
app.get("/seed", async (req, res) => {
  try {
    const [user] = await pool.query(
      "INSERT INTO users (email, pass, height, weight, gender, birthday) VALUES (?, ?, ?, ?, ?, ?)",
      ["test@example.com", "password123", 170.5, 65.0, "male", "1995-06-15"],
    );
    const userId = user.insertId;

    await pool.query(
      "INSERT INTO meal (user_id, date, type, calorie, dish_name, carbohydrate, fat, protein) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, "2025-02-26", "朝", 450.5, "トースト", "60g", "10g", "15g"],
    );

    await pool.query(
      "INSERT INTO weight_graph (user_id, date, weight) VALUES (?, ?, ?)",
      [userId, "2025-02-26", 64.5],
    );

    res.json({ message: "テストデータ投入成功！" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "テストデータ投入失敗", error: err.message });
  }
});

// 全データ確認
app.get("/check", async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    const [meal] = await pool.query("SELECT * FROM meal");
    const [weight_graph] = await pool.query("SELECT * FROM weight_graph");
    res.json({ users, meal, weight_graph });
  } catch (err) {
    res.status(500).json({ message: "確認失敗", error: err.message });
  }
});

app.listen(3000, () => {
  console.log("サーバー起動: http://localhost:3000");
  const url = "http://localhost:3000/login";
  const command =
    process.platform === "darwin"
      ? `open ${url}`
      : process.platform === "win32"
        ? `start ${url}`
        : `xdg-open ${url}`;
  exec(command);
});
