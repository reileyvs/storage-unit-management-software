import { User } from "joy-shared";
import * as dotenv from "dotenv"
import postgres from "postgres"
dotenv.config()
const dbUrl = process.env.DATABASE_URL;
if(!dbUrl) {
  throw new Error("no db")
}

export class SupaUserDao {
  private sql = postgres(dbUrl!)
  readonly tableName = this.sql("user")
  readonly aliasAttr = this.sql("id")
  readonly subscriptionAttr = this.sql("subscribed")
  readonly givingCountAttr = this.sql("times_given")
  readonly lendingCountAttr = this.sql("times_lended")

  async getList(aliases: string[]): Promise<postgres.RowList<postgres.Row[]>> {
    const res = await this.sql`
      SELECT * FROM ${this.tableName}
      WHERE ${this.aliasAttr} IN ${this.sql(aliases)}
    `
    return res
  }
  
  async get(alias: string): Promise<postgres.RowList<postgres.Row[]>> {
    const res = await this.sql`
      SELECT * FROM ${this.tableName}
      WHERE ${this.aliasAttr} = ${alias}`
    if (res.length < 1) {
      throw new Error("No user found")
    }
    return res
  }  
  async put(user: User): Promise<postgres.RowList<postgres.Row[]>> {
    const res = await this.sql`
      INSERT INTO ${this.tableName} (id)
      VALUES (${user.alias})
    `
    return res
  }
  async delete(alias: string): Promise<void> {
    await this.sql`
      DELETE FROM ${this.tableName}
      WHERE ${this.aliasAttr} = ${alias}
    `
  }
  async close(): Promise<void> {
    await this.sql.end()
  }
}