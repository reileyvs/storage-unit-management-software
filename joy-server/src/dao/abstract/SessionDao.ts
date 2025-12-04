import { AuthToken } from "joy-shared"

export interface SessionDao {
  get(token: string): Promise<any>
  put(authToken: AuthToken): Promise<void>
  update(token: string, timestamp: number): Promise<void>
  delete(token: string): Promise<void>
}