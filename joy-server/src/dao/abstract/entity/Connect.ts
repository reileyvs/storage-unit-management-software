import { User } from "joy-shared"

export class Connect {
  user: string | null
  connection: string | null

  constructor(user: string | null, connection: string | null) {
    this.user = user
    this.connection = connection
  }
  
}