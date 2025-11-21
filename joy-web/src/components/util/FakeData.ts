import { GivingItem } from "../items/GivingItem";
import { LendingItem } from "../items/LendingItem";
import { User } from "../User";

export class FakeData {
  fakeData: User[] = [
    new User("Bob", "Dylan", "bob_dyl"),
    new User("Alice", "Johnson", "alice_j"),
    new User("Charlie", "Brown", "charlie_b"),
    new User("Diana", "Prince", "diana_p"),
    new User("Ethan", "Hunt", "ethan_h"),
    new User("Fiona", "Gallagher", "fiona_g"),
    new User("George", "Michaels", "george_m"),
    new User("Hannah", "Smith", "hannah_s"),
    new User("Ian", "Curtis", "ian_c"),
    new User("Julia", "Roberts", "julia_r"),
    new User("Kevin", "Hart", "kevin_h"),
    new User("Laura", "Palmer", "laura_p"),
    new User("Michael", "Scott", "michael_s"),
    new User("Nina", "Simone", "nina_s"),
    new User("Oscar", "Wilde", "oscar_w")
  ];

  constructor() {
    const givingItem = new GivingItem("https://placebear.com/g/200/200", "Shoestring", "Size large, we have too much", 30)
    const lendingItem = new LendingItem("https://placebear.com/g/200/200", "Mechanical bull", "2 day lending, use for parties, etc.", 2)
    this.fakeData.map((user) => {
      user.addGivingItem(givingItem)
      user.addLendingItem(lendingItem)
    })
  }

  getUser(userName: string) {
    return this.fakeData.find(user => user.userName === userName)
  }

}