export interface DatabaseInfo {
  version: string;
  name: string;
  user: string;
}

export interface TableInfo {
  schemaname: string;
  tablename: string;
  tableowner: string;
  tablespace: string | null;
  hasindexes: boolean;
  hasrules: boolean;
  hastriggers: boolean;
  rowsecurity: boolean;
}

export interface DatabaseStats {
  totalTables: number;
  totalSchemas: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
