import { SupaConnectDao } from "../SupaConnectDao";
import { Connect } from "../../abstract/entity/Connect";

describe("Tests SupaConnectDao", () => {

  let connectDao: SupaConnectDao

  beforeAll(async () => {
    connectDao = new SupaConnectDao()
    await connectDao.put(new Connect("testUser1", "testUser2"))
  })

  it("gets a connection", async () => {
    await connectDao.getConnections("testUser1")
  })

  // it("tests put function", async () => {
  //   const res = await connectDao.put(new Connect("dyldyl", "dyldyl1"))
  //   expect(res).toBeNull()
  //   connectDao.close()
  // })

  afterAll(async () => {
    await connectDao.delete(new Connect("testUser1", "testUser2"))
    connectDao.close()
  })

})