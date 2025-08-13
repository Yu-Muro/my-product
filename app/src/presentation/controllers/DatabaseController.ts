import { Context } from 'hono';
import { DatabaseUseCase } from '../../application/usecases/DatabaseUseCase';
import { PostgresDatabaseRepository } from '../../infrastructure/database/PostgresDatabaseRepository';

export class DatabaseController {
  private databaseUseCase: DatabaseUseCase;

  constructor(env: any) {
    const repository = new PostgresDatabaseRepository(env.HYPERDRIVE.connectionString);
    this.databaseUseCase = new DatabaseUseCase(repository);
  }

  async getDatabaseInfo(c: Context) {
    const result = await this.databaseUseCase.getDatabaseInfo();

    if (result.success) {
      return c.json({
        success: true,
        database: result.data,
        timestamp: result.timestamp,
      });
    } else {
      return c.json({
        success: false,
        error: result.error,
        timestamp: result.timestamp,
      }, 500);
    }
  }

  async getAllTables(c: Context) {
    const result = await this.databaseUseCase.getAllTables();

    if (result.success) {
      return c.json({
        success: true,
        result: result.data,
        count: result.data?.length || 0,
        timestamp: result.timestamp,
      });
    } else {
      return c.json({
        success: false,
        error: result.error,
        timestamp: result.timestamp,
      }, 500);
    }
  }

  async getTablesList(c: Context) {
    const result = await this.databaseUseCase.getTablesList();

    if (result.success) {
      return c.json({
        success: true,
        tables: result.data,
        count: result.data?.length || 0,
        timestamp: result.timestamp,
      });
    } else {
      return c.json({
        success: false,
        error: result.error,
        timestamp: result.timestamp,
      }, 500);
    }
  }

  async getDatabaseStats(c: Context) {
    const result = await this.databaseUseCase.getDatabaseStats();

    if (result.success) {
      return c.json({
        success: true,
        stats: result.data,
        timestamp: result.timestamp,
      });
    } else {
      return c.json({
        success: false,
        error: result.error,
        timestamp: result.timestamp,
      }, 500);
    }
  }
}
