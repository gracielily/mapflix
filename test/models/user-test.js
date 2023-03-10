import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testUser, testUsers } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("User Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.userStore.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(testUser);
    assertSubset(testUser, newUser);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAllUsers();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(testUser);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });

  test("update user - success", async () => {
    const user = await db.userStore.addUser(testUser)
    const updatedUser = {...testUser}
    updatedUser.firstName = "Updated"
    await db.userStore.update(user, updatedUser);
    const returnedUser = await db.userStore.getUserById(user._id)
    assert.equal(returnedUser.firstName, "Updated")
  });

  test("update user - fail", async () => {
    await db.userStore.addUser(testUser)
    const updatedUser = {...testUser}
    updatedUser.firstName = "Updated"
    await db.userStore.update("invalid", updatedUser);
    const users = await db.userStore.getAllUsers();
    // users not updated
    users.forEach((user) => {
      assert.notEqual(user.firstName, "Updated");
    })
  });

  test("toggle admin - enable success", async () => {
    const user = await db.userStore.addUser(testUser)
    assert.equal(user.isAdmin, false)
    await db.userStore.toggleAdmin(user._id);
    const returnedUser = await db.userStore.getUserById(user._id)
    assert.equal(returnedUser.isAdmin, true)
  });

  test("toggle admin - disable success", async () => {
    const adminUser = {...testUser}
    adminUser.isAdmin = true
    const user = await db.userStore.addUser(adminUser)
    assert.equal(user.isAdmin, true)
    await db.userStore.toggleAdmin(user._id);
    const returnedUser = await db.userStore.getUserById(user._id)
    assert.equal(returnedUser.isAdmin, false)
  });

  test("toggle admin - fail", async () => {
    const user = await db.userStore.addUser(testUser)
    assert.equal(user.isAdmin, false)
    await db.userStore.toggleAdmin();
    // user not updated
    const returnedUser = await db.userStore.getUserById(user._id)
    assert.equal(returnedUser.isAdmin, false)
  });

});
