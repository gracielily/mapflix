import { assert } from "chai";
import { mapflixService } from "./mapflix-service.js";
import { assertSubset } from "../utils.js";
import { testUser, testUsers } from "../fixtures.js";

const users = new Array(testUsers.length);

suite("User API Tests", () => {
  const _createUserAndToken = async () => {
    await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUser);
  }
  setup(async () => {
    mapflixService.clearAuth();
    await _createUserAndToken();
    await mapflixService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await mapflixService.createUser(testUsers[i]);
    }
    await _createUserAndToken()
  });
  teardown(async () => {
  });

  test("Gets all Users - Success", async () => {
    const returnedUsers = await mapflixService.getAllUsers();
    assert.deepEqual(returnedUsers.length, 4);
  });

  test("Creates a User", async () => {
    const newUser = await mapflixService.createUser(testUser);
    assertSubset(testUser, newUser);
    assert.isDefined(newUser._id);
  });

  test("Deletes a User", async () => {
    const returnedUsers = await mapflixService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await mapflixService.deleteUser(users[0]._id);
    const usersAfterDelete = await mapflixService.getAllUsers();
    assert.equal(usersAfterDelete.length, 3);
  });

  test("Deletes a User - fail", async () => {
    const returnedUsers = await mapflixService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    try {
      await mapflixService.deleteUser("invalid");
      assert.fail("does not delete user")
    } catch (error) {
      const usersAfterDelete = await mapflixService.getAllUsers();
      assert.equal(usersAfterDelete.length, 4);
    }
  });

  test("Deletes all Users", async () => {
    let returnedUsers = await mapflixService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await mapflixService.deleteAllUsers();
    await _createUserAndToken()
    returnedUsers = await mapflixService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("Gets a User - Success", async () => {
    const returnedUser = await mapflixService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("Gets a User - Invalid Id", async () => {
    try {
      await mapflixService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("Gets a User - User Deleted", async () => {
    await mapflixService.deleteAllUsers();
    try {
      await _createUserAndToken();
      await mapflixService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.message, "Not Found.");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
