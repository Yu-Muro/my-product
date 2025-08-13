# My Product - Hono API

Cloudflare Workers + Hono + PostgreSQL を使用したAPIサーバー

## 環境設定

このプロジェクトは2つの環境をサポートしています。

### ローカル環境

```bash
# ローカル環境でサーバーを起動（ローカルPostgreSQL）
npm run dev
```

### 本番環境

```bash
# 本番環境でローカルサーバーを起動（リモートデータベース）
npm run dev:remote

# 本番環境にデプロイ
npm run deploy
```

## データベース設定

### ローカル環境
- ローカルPostgreSQLデータベースを使用
- `wrangler.jsonc`の`localConnectionString`で設定
- 接続文字列: `postgresql://username:password@localhost:5432/my_product_dev`

### 本番環境
- Cloudflare Hyperdriveを使用
- リモートデータベースに接続

## 利用可能なエンドポイント

- `GET /api` - すべてのテーブル情報
- `GET /api/db-info` - データベース情報
- `GET /api/tables` - テーブル一覧
- `GET /api/stats` - データベース統計

## 環境変数の設定

### ローカル環境
ローカル環境では、`wrangler.jsonc`の`localConnectionString`で設定します：

```json
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "your-hyperdrive-id",
      "localConnectionString": "postgresql://username:password@localhost:5432/my_product_dev"
    }
  ]
}
```

### 本番環境
本番環境では、Hyperdriveの設定が自動的に使用されます。

## 開発

```bash
# 依存関係のインストール
npm install

# 型定義の生成
npm run type

# テストの実行
npm test
```
