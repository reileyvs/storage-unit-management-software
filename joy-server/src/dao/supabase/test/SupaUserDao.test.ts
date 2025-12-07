import { SupaUserDao } from "../SupaUserDao";
import { User } from "joy-shared";

describe("Tests SupaUserDao", () => {

  let userDao: SupaUserDao | null;
  const userAlias = "king"

  beforeAll(async () => {
    userDao = new SupaUserDao()

    await userDao.put("Bob", "Dylan", "king", "password", "a.jpg")
    await userDao.put("Jane", "Jillan", "queen", "password", "a.jpg")
  })

  it("gets a user from the db", async () => {
    const res = await userDao!.get(userAlias)
    expect(res).not.toBeNull()
    expect(res!.alias).toBe(userAlias)
  })

  it("get a list of users from the db", async () => {
    const aliasList = [userAlias, "queen"]
    const res = await userDao!.getList(aliasList)
    expect(res[0]).not.toBeUndefined()
    expect(res[0]!.alias).toBe(userAlias)
    expect(res[1]!.alias).toBe("queen")
  })

  // it("tests put and delete function", async () => {
  //   const res = await userDao!.put(new User("bob", "dylan", "dyldyl1", "pitcher.png"))
  //   expect(res).not.toBeNull()
  // })

  afterAll(async () => {
    await userDao!.delete(userAlias)
    await userDao!.delete("queen")
    userDao?.close()
  })
})