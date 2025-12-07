import { User, UserDto } from "joy-shared";
import * as dotenv from "dotenv"
import postgres, { Row, RowList } from "postgres"
import { UserDao } from "../abstract/UserDao";
import bcrypt from "bcryptjs";
dotenv.config()
const dbUrl = process.env.DATABASE_URL;
if(!dbUrl) {
  throw new Error("no db")
}

export class SupaUserDao implements UserDao {
  private sql = postgres(dbUrl!)
  readonly tableName = "user"
  readonly aliasAttr = "id"
  readonly subscriptionAttr = "subscribed"
  readonly givingCountAttr = "times_given"
  readonly lendingCountAttr = "times_lended"
  readonly connectionCountAttr = "connection_count"
  readonly passwordAttr = "password_hash"

  private mapRowToUser(row: any): UserDto {
    return {
      firstName: row.first_name,
      lastName: row.last_name,
      alias: row.id,
      imageUrl: row.image_url,
    }
  }

  async register(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<UserDto> {
    const res = await this.put(firstName, lastName, alias, bcrypt.hashSync(password), imageUrl)
    const user = this.mapRowToUser(res[0])
    return user
  }
  async login(alias: string, password: string): Promise<UserDto | null> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.aliasAttr)} = ${alias}`
    if (!res[0] || !bcrypt.compareSync(password, res[0].password_hash)) {
      return null
    }
    return this.mapRowToUser(res[0])
  }

  async getList(aliases: string[]): Promise<UserDto[]> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.aliasAttr)} IN ${this.sql(aliases)}
    `
    const users = res.map(user => this.mapRowToUser(user))
    return users ? users : []
  }
  
  async get(alias: string): Promise<UserDto | null> {
    const res = await this.sql`
      SELECT * FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.aliasAttr)} = ${alias}`
    if (res.length < 1) {
      throw new Error("No user found")
    }
    const user = this.mapRowToUser(res[0])
    return user
  }  
  async put(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<RowList<Row[]>> {
    const res = await this.sql`
      INSERT INTO ${this.sql(this.tableName)} (id, first_name, last_name, password_hash, image_url)
      VALUES (${alias}, ${firstName}, ${lastName}, ${password}, ${imageUrl})
      RETURNING *
    `
    return res
  }
  async delete(alias: string): Promise<void> {
    await this.sql`
      DELETE FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.aliasAttr)} = ${alias}
    `
  }
  async close(): Promise<void> {
    await this.sql.end()
  }
  async getConnectionCount(alias: string): Promise<number> {
    const res = await this.sql`
      SELECT ${this.sql(this.connectionCountAttr)} FROM ${this.sql(this.tableName)}
      WHERE ${this.sql(this.aliasAttr)} = ${alias}
    `
    const count = res[0].connection_count as number
    return count
  }
  async addConnection(alias: string): Promise<number> {
    const res = await this.sql`
      UPDATE ${this.sql(this.tableName)}
      SET ${this.sql(this.connectionCountAttr)} = ${this.sql(this.connectionCountAttr)} + 1
      WHERE ${this.sql(this.aliasAttr)} = ${alias}
      RETURNING *
    `
    const count = res[0].connection_count as number
    return count
  }
  async removeConnection(alias: string): Promise<number> {
    const res = await this.sql`
      UPDATE ${this.sql(this.tableName)}
      SET ${this.sql(this.connectionCountAttr)} = ${this.sql(this.connectionCountAttr)} - 1
      WHERE ${this.sql(this.aliasAttr)} = ${alias}
      RETURNING *
    `
    const count = res[0].connection_count as number
    return count
  }
}