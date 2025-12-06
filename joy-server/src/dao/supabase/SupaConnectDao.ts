import { ConnectDao } from "../abstract/ConnectDao"
import { Connect } from "../abstract/entity/Connect"
import * as dotenv from "dotenv"
import postgres from "postgres"
dotenv.config()
const dbUrl = process.env.DATABASE_URL;
if(!dbUrl) {
  throw new Error("no db")
}
export class SupaConnectDao implements ConnectDao {
  sql = postgres(dbUrl!)
  readonly tableName = "connection"
  readonly userAttr = "user_id"
  readonly connectionAttr = "connection_id"

  async getConnections(alias: string): Promise<Connect> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.userAttr} = ${alias}`
    return new Connect(null, null)
  }
  async put(connect: Connect): Promise<void> {
    const res = await this.sql`
      INSERT INTO ${this.sql(this.tableName)} (user_id, connection_id)
      VALUES (${connect.user}, ${connect.connection})
    `;
  }
  async delete(connect: Connect): Promise<void> {
    await this.sql`
      DELETE FROM ${this.sql(this.tableName)}
      WHERE ${this.userAttr} = ${connect.user} && ${this.connectionAttr} = ${connect.connection}
    `
  }

  async close(): Promise<void> {
    await this.sql.end()
  }
}