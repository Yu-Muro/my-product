import { DatabaseRepository } from '../../domain/repositories/DatabaseRepository';
import { DatabaseInfo, TableInfo, DatabaseStats, ApiResponse } from '../../domain/entities/DatabaseInfo';

export class DatabaseUseCase {
  constructor(private databaseRepository: DatabaseRepository) {}

  async getDatabaseInfo(): Promise<ApiResponse<DatabaseInfo>> {
    try {
      const data = await this.databaseRepository.getDatabaseInfo();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAllTables(): Promise<ApiResponse<TableInfo[]>> {
    try {
      const data = await this.databaseRepository.getAllTables();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getTablesList(): Promise<ApiResponse<TableInfo[]>> {
    try {
      const data = await this.databaseRepository.getTablesList();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getDatabaseStats(): Promise<ApiResponse<DatabaseStats>> {
    try {
      const data = await this.databaseRepository.getDatabaseStats();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
