// filepath: src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DatabaseController } from './presentation/controllers/DatabaseController';

// Honoアプリケーションの作成
const app = new Hono<{ Bindings: Env }>();

// CORSミドルウェアを追加
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// ヘルスチェックエンドポイント
app.get('/', (c) => {
  return c.json({
    message: 'Hello from Hono!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ヘルスチェック専用エンドポイント
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'my-product-api',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// データベース関連のエンドポイント
app.get('/api', async (c) => {
  const controller = new DatabaseController(c.env);
  return controller.getAllTables(c);
});

app.get('/api/db-info', async (c) => {
  const controller = new DatabaseController(c.env);
  return controller.getDatabaseInfo(c);
});

app.get('/api/tables', async (c) => {
  const controller = new DatabaseController(c.env);
  return controller.getTablesList(c);
});

app.get('/api/stats', async (c) => {
  const controller = new DatabaseController(c.env);
  return controller.getDatabaseStats(c);
});

// 静的ファイルの配信
app.get('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

// エラーハンドリング
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    error: 'Internal Server Error',
    timestamp: new Date().toISOString()
  }, 500);
});

// 404ハンドリング
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not Found',
    timestamp: new Date().toISOString()
  }, 404);
});

export default app;
