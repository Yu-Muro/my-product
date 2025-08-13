import { Hono } from 'hono';
import { DatabaseController } from '../controllers/DatabaseController';

export function createDatabaseRoutes(env: any) {
  const router = new Hono();
  const controller = new DatabaseController(env);

  // データベース情報エンドポイント
  router.get('/db-info', (c) => controller.getDatabaseInfo(c));

  // テーブル一覧エンドポイント
  router.get('/tables', (c) => controller.getTablesList(c));

  // 統計情報エンドポイント
  router.get('/stats', (c) => controller.getDatabaseStats(c));

  return router;
}
