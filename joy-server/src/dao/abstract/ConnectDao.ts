import postgres from "postgres"
import { Connect } from "./entity/Connect"

export interface ConnectDao {
  get(): Promise<Connect>
  put(connect: Connect): Promise<postgres.RowList<postgres.Row[]>>
  update(): Promise<void>
}