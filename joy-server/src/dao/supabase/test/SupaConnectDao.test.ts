import { SupaConnectDao } from "../SupaConnectDao";
import { Connect } from "../../abstract/entity/Connect";

describe("Tests SupaConnectDao", () => {

  it("tests put function", async () => {
    const connectDao = new SupaConnectDao()
    const res = await connectDao.put(new Connect("1", "2"))
    console.log(res.columns)
    expect(res).not.toBeNull()
  })
})