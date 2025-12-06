import postgres from "postgres"
import { Connect } from "./entity/Connect"

export interface ConnectDao {
  getConnections(alias: string): Promise<Connect>
  put(connect: Connect): Promise<void>
  delete(connect: Connect): Promise<void>
}