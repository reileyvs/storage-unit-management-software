import postgres, { Row, RowList } from "postgres"
import { Connect } from "./entity/Connect"


export interface ConnectDao {
  get(connection: Connect): Promise<RowList<Row[]>>
  getConnections(alias: string): Promise<RowList<Row[]>>
  put(connect: Connect): Promise<void>
  delete(connect: Connect): Promise<void>
}