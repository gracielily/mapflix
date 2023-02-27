import { assert } from "chai";
import { mapflixService } from "./mapflix-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { testUser } from "../fixtures.js";

suite("Authentication", async () => {
  setup(async () => {
    mapflixService.clearAuth();
    await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUser);
    await mapflixService.deleteAllUsers();
  });

  test("it creates auth token", async () => {
    mapflixService.clearAuth();
    const returnedUser = await mapflixService.createUser(testUser);
    const response = await mapflixService.authenticate(returnedUser);
    assert(response.success);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("it does not create auth token", async () => {
    mapflixService.clearAuth();
    try {
        await mapflixService.authenticate(testUser);
    } catch(error) {
        assert.equal(error.response.data.statusCode, 401)
        assert.equal(error.response.data.message, "Invalid Credentials")
    }
  });

  test("it does not allow api interaction without token", async () => {
    mapflixService.clearAuth();
    const returnedUser = await mapflixService.createUser(testUser);
    try {
      await mapflixService.getAllUsers();
      assert.fail('Throw Err')
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });


  test("it allows api interaction with token", async () => {
    const returnedUser = await mapflixService.createUser(testUser);
    await mapflixService.authenticate(returnedUser);
    const response = await mapflixService.getAllUsers();
    assert.equal(response.length, 1)
  });
  

});
