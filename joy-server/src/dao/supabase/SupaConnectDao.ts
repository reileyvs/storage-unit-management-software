import { ConnectDao } from "../abstract/ConnectDao"
import { Connect } from "../abstract/entity/Connect"
import * as dotenv from "dotenv"
import postgres from "postgres"
dotenv.config()
const dbUrl = process.env.DATABASE_URL;
if(!dbUrl) {
  throw new Error("no db")
}
const sql = postgres(dbUrl)
export class SupaConnectDao implements ConnectDao {
  readonly tableName = "connection"


  async get(): Promise<Connect> {
    return new Connect(null, null)
  }
  async put(connect: Connect): Promise<postgres.RowList<postgres.Row[]>> {
    const res = await sql`
      INSERT INTO ${sql(this.tableName)} (user_id, connection_id)
      VALUES (${connect.user}, ${connect.connection})
    `;
    return res
  }
  async update(): Promise<void> {
    
  }
}