import postgres from 'postgres';
import { DatabaseRepository } from '../../domain/repositories/DatabaseRepository';
import { DatabaseInfo, TableInfo, DatabaseStats } from '../../domain/entities/DatabaseInfo';

export class PostgresDatabaseRepository implements DatabaseRepository {
  private sql: postgres.Sql;

  constructor(connectionString: string) {
    this.sql = postgres(connectionString);
  }

  async getDatabaseInfo(): Promise<DatabaseInfo> {
    const result = await this.sql`
      SELECT
        version(),
        current_database() as current_database,
        current_user as current_user
      LIMIT 1
    `;

    if (!result || result.length === 0) {
      throw new Error('Failed to get database info');
    }

    const info = result[0];
    return {
      version: info.version,
      name: info.current_database,
      user: info.current_user,
    };
  }

  async getAllTables(): Promise<TableInfo[]> {
    const result = await this.sql`
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

    return result.map(table => ({
      schemaname: table.schemaname,
      tablename: table.tablename,
      tableowner: table.tableowner,
      tablespace: table.tablespace,
      hasindexes: table.hasindexes,
      hasrules: table.hasrules,
      hastriggers: table.hastriggers,
      rowsecurity: table.rowsecurity,
    }));
  }

  async getTablesList(): Promise<TableInfo[]> {
    const result = await this.sql`
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
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    return result.map(table => ({
      schemaname: table.schemaname,
      tablename: table.tablename,
      tableowner: table.tableowner,
      tablespace: table.tablespace,
      hasindexes: table.hasindexes,
      hasrules: table.hasrules,
      hastriggers: table.hastriggers,
      rowsecurity: table.rowsecurity,
    }));
  }

  async getDatabaseStats(): Promise<DatabaseStats> {
    const [tableCountResult, schemaCountResult] = await Promise.all([
      this.sql`
        SELECT COUNT(*) as count
        FROM pg_tables
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      `,
      this.sql`
        SELECT COUNT(DISTINCT schemaname) as count
        FROM pg_tables
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      `
    ]);

    return {
      totalTables: Number(tableCountResult[0]?.count || 0),
      totalSchemas: Number(schemaCountResult[0]?.count || 0),
    };
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}
