# 食事・体重管理アプリ

食事記録・体重管理を行うWebアプリケーションです。

---

## 技術スタック

| 項目           | 技術                         |
| -------------- | ---------------------------- |
| バックエンド   | Node.js / Express            |
| データベース   | TiDB Serverless（MySQL互換） |
| バージョン管理 | Git / GitHub                 |

---

## 環境構築手順

### 1. リポジトリをクローン

git clone https://github.com/yourname/your-repo.git
cd your-repo

### 2. Node.js バージョン確認

node -v # v18以上推奨

### 3. パッケージインストール

npm install

### 4. 環境変数の設定

.env.example をコピーして .env を作成し、共有された接続情報を入力してください。

cp .env.example .env

.env の中身：
DB_HOST=xxxxxxxxx.ap-northeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=xxxxxxxxx.root
DB_PASSWORD=※チームメンバーから受け取る
DB_NAME=menuManagement

⚠️ .env は絶対にGitHubにコミットしないでください。

---

## 起動方法

node app.js

起動すると自動でブラウザが開きます。

| URL                         | 内容             |
| --------------------------- | ---------------- |
| http://localhost:3000/test  | 接続確認         |
| http://localhost:3000/seed  | テストデータ投入 |
| http://localhost:3000/check | 全データ確認     |

---

## DB構成

使用サービス: TiDB Serverless（MySQL互換）
管理画面: https://tidbcloud.com
リージョン: Tokyo (ap-northeast-1)
DB名: menuManagement

### usersテーブル

| カラム名   | 型           | 制約               | 説明           |
| ---------- | ------------ | ------------------ | -------------- |
| id         | INT          | PK, AUTO_INCREMENT | 自動採番       |
| email      | VARCHAR(255) | NOT NULL           | メールアドレス |
| pass       | VARCHAR(255) | NOT NULL           | パスワード     |
| height     | DECIMAL(5,2) | NOT NULL           | 身長           |
| weight     | DECIMAL(5,2) | NOT NULL           | 目標体重       |
| gender     | VARCHAR(255) | NOT NULL           | 性別           |
| birthday   | DATE         | NOT NULL           | 生年月日       |
| created_at | TIMESTAMP    | NOT NULL           | 登録日時       |
| update_at  | TIMESTAMP    | NOT NULL           | 更新日時       |

### mealテーブル

| カラム名     | 型           | 制約               | 説明            |
| ------------ | ------------ | ------------------ | --------------- |
| id           | INT          | PK, AUTO_INCREMENT | 自動採番        |
| user_id      | INT          | FK, NOT NULL       | usersの外部キー |
| date         | DATE         | NOT NULL           | 日付            |
| type         | VARCHAR(255) | NOT NULL           | 朝/昼/夜        |
| calorie      | DECIMAL      | NOT NULL           | カロリー        |
| dish_name    | VARCHAR(255) | NOT NULL           | 料理名          |
| carbohydrate | VARCHAR(255) | -                  | 炭水化物        |
| fat          | VARCHAR(255) | -                  | 脂質            |
| protein      | VARCHAR(255) | -                  | タンパク質      |
| created_at   | TIMESTAMP    | NOT NULL           | 登録日時        |

### weight_graphテーブル

| カラム名   | 型           | 制約               | 説明            |
| ---------- | ------------ | ------------------ | --------------- |
| id         | INT          | PK, AUTO_INCREMENT | 自動採番        |
| user_id    | INT          | FK, NOT NULL       | usersの外部キー |
| date       | DATE         | NOT NULL           | 記録日          |
| weight     | DECIMAL(5,2) | NOT NULL           | 現在の体重      |
| created_at | TIMESTAMP    | NOT NULL           | 登録日時        |

---

## API一覧

### 接続・テスト

| メソッド | エンドポイント | 説明             |
| -------- | -------------- | ---------------- |
| GET      | /test          | DB接続確認       |
| GET      | /seed          | テストデータ投入 |
| GET      | /check         | 全データ確認     |

### ユーザー

| メソッド | エンドポイント | 説明             |
| -------- | -------------- | ---------------- |
| POST     | /users         | ユーザー登録     |
| GET      | /users         | ユーザー一覧取得 |

リクエスト例（POST /users）:
{
"email": "test@example.com",
"pass": "password123",
"height": 170.5,
"weight": 65.0,
"gender": "male",
"birthday": "1995-06-15"
}

### 食事

| メソッド | エンドポイント | 説明         |
| -------- | -------------- | ------------ |
| POST     | /meal          | 食事登録     |
| GET      | /meal          | 食事一覧取得 |

リクエスト例（POST /meal）:
{
"user_id": 1,
"date": "2025-02-26",
"type": "朝",
"calorie": 450.5,
"dish_name": "トースト",
"carbohydrate": "60g",
"fat": "10g",
"protein": "15g"
}

### 体重

| メソッド | エンドポイント | 説明         |
| -------- | -------------- | ------------ |
| POST     | /weight_graph  | 体重登録     |
| GET      | /weight_graph  | 体重一覧取得 |

リクエスト例（POST /weight_graph）:
{
"user_id": 1,
"date": "2025-02-26",
"weight": 64.5
}

---

## ブランチ運用ルール

### ブランチ構成

| ブランチ名     | 用途                     |
| -------------- | ------------------------ |
| main           | 本番用（直接pushしない） |
| develop        | 開発統合ブランチ         |
| feature/機能名 | 各自の作業ブランチ       |

### 作業の流れ

1. developから作業ブランチを作成
   git checkout develop
   git pull origin develop
   git checkout -b feature/機能名

2. 作業・コミット
   git add .
   git commit -m "feat: ○○機能を追加"

3. Pull Requestを作成してレビュー依頼
4. レビューOK後にdevelopにマージ

### コミットメッセージのテンプレート

以下のフォーマットに従ってコミットメッセージを書いてください。

```
[プレフィックス]: [変更内容の要約]

[詳細（任意）]
- 変更点1
- 変更点2

[関連Issue（任意）]
Close #Issue番号
```

#### 記載例

```
feat: ユーザー登録APIを追加

- POST /users エンドポイントを実装
- バリデーション処理を追加

Close #12
```

```
fix: 食事登録時のカロリー計算バグを修正

- 小数点以下の計算が正しくなかった問題を修正
```

```
docs: READMEにAPI一覧を追加
```

#### プレフィックス一覧

| プレフィックス | 用途                                   |
| -------------- | -------------------------------------- |
| feat:          | 新機能追加                             |
| fix:           | バグ修正                               |
| docs:          | ドキュメント変更                       |
| refactor:      | リファクタリング                       |
| chore:         | 設定変更など                           |
| test:          | テスト追加・修正                       |
| style:         | コードスタイル修正（動作に影響しない） |

## 注意事項

- .env は絶対にGitHubにコミットしない
- 作業は必ずfeatureブランチで行う
- mainへの直接pushは禁止
- パスワードは平文で保存しない（bcryptでハッシュ化すること）
