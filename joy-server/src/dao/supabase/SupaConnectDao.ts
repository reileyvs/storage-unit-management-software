import { ConnectDao } from "../abstract/ConnectDao";
import { Connect } from "../abstract/entity/Connect";
import * as dotenv from "dotenv";
import postgres, { Row, RowList } from "postgres";
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("no db");
}
export class SupaConnectDao implements ConnectDao {
  sql = postgres(dbUrl!);
  readonly tableName = "connection";
  readonly userAttr = "user_id";
  readonly connectionAttr = "connection_id";

  async get(connection: Connect): Promise<RowList<Row[]>> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.userAttr)} = ${connection.user} AND ${this.sql(
      this.connectionAttr
    )} = ${connection.connection}
    `;
    return res;
  }

  async getConnections(alias: string): Promise<RowList<Row[]>> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.userAttr)} = ${alias}
    `;
    return res;
  }

  async put(connect: Connect): Promise<void> {
    await this.sql`
      INSERT INTO ${this.sql(this.tableName)} (user_id, connection_id)
      VALUES (${connect.user}, ${connect.connection})
    `;
  }

  async delete(connect: Connect): Promise<void> {
    await this.sql`
      DELETE FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.userAttr)} = ${connect.user} AND ${this.sql(
      this.connectionAttr
    )} = ${connect.connection}
    `;
  }

  async close(): Promise<void> {
    await this.sql.end();
  }
}
