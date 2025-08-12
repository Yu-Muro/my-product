// filepath: src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import postgres from "postgres";

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

// データベース情報エンドポイント
app.get('/api/db-info', async (c) => {
  const env = c.env;

  const sql = postgres(env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  try {
    // データベースの基本情報を取得
    const version = await sql`SELECT version()`;
    const currentDatabase = await sql`SELECT current_database()`;
    const currentUser = await sql`SELECT current_user`;

    c.executionCtx.waitUntil(sql.end());

    return c.json({
      success: true,
      database: {
        version: version[0]?.version,
        name: currentDatabase[0]?.current_database,
        user: currentUser[0]?.current_user
      },
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    console.error("Database error:", e.message);

    return c.json({
      success: false,
      error: e.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// テーブル一覧エンドポイント
app.get('/api/tables', async (c) => {
  const env = c.env;

  const sql = postgres(env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  try {
    // テーブル一覧を取得
    const result = await sql`
      SELECT
        schemaname,
        tablename,
        tableowner,
        tablespace,
        hasindexes,
        hasrules,
        hastriggers,
        rowsecurity
      FROM pg_tables
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY schemaname, tablename
    `;

    c.executionCtx.waitUntil(sql.end());

    return c.json({
      success: true,
      tables: result,
      count: result.length,
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    console.error("Database error:", e.message);

    return c.json({
      success: false,
      error: e.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 統計情報エンドポイント
app.get('/api/stats', async (c) => {
  const env = c.env;

  const sql = postgres(env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  try {
    // データベース統計情報を取得
    const tableCount = await sql`SELECT COUNT(*) as count FROM pg_tables WHERE schemaname NOT IN ('information_schema', 'pg_catalog')`;
    const schemaCount = await sql`SELECT COUNT(DISTINCT schemaname) as count FROM pg_tables WHERE schemaname NOT IN ('information_schema', 'pg_catalog')`;

    c.executionCtx.waitUntil(sql.end());

    return c.json({
      success: true,
      stats: {
        totalTables: tableCount[0]?.count || 0,
        totalSchemas: schemaCount[0]?.count || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    console.error("Database error:", e.message);

    return c.json({
      success: false,
      error: e.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 既存のAPIエンドポイント（後方互換性のため）
app.get('/api', async (c) => {
  const env = c.env;

  // Create a database client that connects to your database via Hyperdrive
  const sql = postgres(env.HYPERDRIVE.connectionString, {
    // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
    max: 5,
    // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
    fetch_types: false,
  });

  try {
    // A very simple test query
    const result = await sql`select * from pg_tables`;

    // Clean up the client, ensuring we don't kill the worker before that is
    // completed.
    c.executionCtx.waitUntil(sql.end());

    // Return result rows as JSON
    return c.json({
      success: true,
      result: result,
      count: result.length,
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    console.error("Database error:", e.message);

    return c.json({
      success: false,
      error: e.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
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
