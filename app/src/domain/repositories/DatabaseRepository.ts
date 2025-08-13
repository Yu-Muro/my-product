import { DatabaseInfo, TableInfo, DatabaseStats } from '../entities/DatabaseInfo';

export interface DatabaseRepository {
  getDatabaseInfo(): Promise<DatabaseInfo>;
  getAllTables(): Promise<TableInfo[]>;
  getTablesList(): Promise<TableInfo[]>;
  getDatabaseStats(): Promise<DatabaseStats>;
}
