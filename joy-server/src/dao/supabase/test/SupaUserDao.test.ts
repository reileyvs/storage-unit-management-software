import { SupaUserDao } from "../SupaUserDao";
import { User } from "joy-shared";

describe("Tests SupaUserDao", () => {

  let userDao: SupaUserDao | null;
  const userAlias = "king"

  beforeAll(async () => {
    userDao = new SupaUserDao()

    await userDao.put(new User("Bob", "Dylan", "king", "a.jpg"))
    await userDao.put(new User("Jane", "Jillan", "queen", "a.jpg"))
  })

  it("gets a user from the db", async () => {
    const res = await userDao!.get(userAlias)
    expect(res).not.toBeNull()
    expect(res[0].id).toBe(userAlias)
  })

  it("get a list of users from the db", async () => {
    const aliasList = [userAlias, "queen"]
    const res = await userDao!.getList(aliasList)
    expect(res[0].id).toBe(userAlias)
    expect(res[1].id).toBe("queen")
  })

  // it("tests put function", async () => {
  //   const res = await userDao!.put(new User("bob", "dylan", "dyldyl1", "pitcher.png"))
  //   expect(res).not.toBeNull()
  // })

  afterAll(async () => {
    await userDao!.delete(userAlias)
    await userDao!.delete("queen")
    userDao?.close()
  })
})