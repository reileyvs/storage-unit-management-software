import { SupaConnectDao } from "../SupaConnectDao";
import { Connect } from "../../abstract/entity/Connect";

describe("Tests SupaConnectDao", () => {

  let connectDao: SupaConnectDao

  beforeAll(async () => {
    connectDao = new SupaConnectDao()
    await connectDao.put(new Connect("testUser1", "testUser2"))
    await connectDao.put(new Connect("testUser1", "testUser3"))
  })

  it("gets a connection", async () => {
    const res = await connectDao.get(new Connect("testUser1", "testUser2"))
    expect(res[0]).not.toBeNull()
    expect(res[0].user_id).toBe("testUser1")
  })

  it("gets a list of connections", async () => {
    const res = await connectDao.getConnections("testUser1")
    expect(res[0]).not.toBeNull()
    expect(res[0].user_id).toBe("testUser1")
    expect(res[1]).not.toBeNull()
    expect(res[1].connection_id).toBe("testUser3")
  })

  // it("tests put function", async () => {
  //   const res = await connectDao.put(new Connect("dyldyl", "dyldyl1"))
  //   expect(res).toBeNull()
  //   connectDao.close()
  // })

  afterAll(async () => {
    await connectDao.delete(new Connect("testUser1", "testUser2"))
    await connectDao.delete(new Connect("testUser1", "testUser3"))
    connectDao.close()
  })

})