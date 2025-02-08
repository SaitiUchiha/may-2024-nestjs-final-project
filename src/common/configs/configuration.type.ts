export class PostgresConfig {
  port: number;
  database: {
    host: string | undefined;
    port: number;
    password: string | undefined;
    user: string | undefined;
    database: string | undefined;
  };
}
