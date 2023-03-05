import { EventEmitter } from "events";
import { assert } from "chai";
import { mapflixService } from "./mapflix-service.js";
import { assertSubset } from "../utils.js";
import { testUser, testUserCredentials, testShow, testShows } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Show API tests", () => {
  let user = null;

  setup(async () => {
    mapflixService.clearAuth();
    user = await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUserCredentials);
    await mapflixService.deleteAllShows();
    await mapflixService.deleteAllUsers();
    user = await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUserCredentials);
    testShow.userid = user._id;
  });

  teardown(async () => {});

  test("create show - success", async () => {
    const createdShow = await mapflixService.createShow({title: "test movie", imdbId: "tt839038"});
    assert.isNotNull(createdShow);
    assertSubset(createdShow, testShow);
  });

  test("create show - bad payload", async () => {
    try {
        // invalid imdbId
        await mapflixService.createShow({title: "test movie", imdbId: "t839038"});
        assert.fail("Should return a 400");
      } catch (error) {
        assert.equal(error.response.status, 400);
        assert.equal(error.response.data.message, "Invalid request payload input");
      }
  });

  test("delete a show - success", async () => {
    const show = await mapflixService.createShow({title: "test movie", imdbId: "tt839038"});
    const response = await mapflixService.deleteShow(show._id);
    assert.equal(response.status, 204);
    try {
      await mapflixService.getShow(show._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });


  test("delete a show - invalid id", async () => {
    await mapflixService.createShow({title: "test movie", imdbId: "tt839038"});
    try {
      await mapflixService.deleteShow("");
      assert.fail("Should get a 404");
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });

  test("delete show that does not exist - fail", async () => {
    try {
      await mapflixService.deleteShow("invalid");
      assert.fail("Should not delete");
    } catch (error) {
      assert.equal(error.response.data.message, "Could not delete Show");
    }
  });

  test("create multiple shows", async () => {
    for (let i = 0; i < testShows.length; i += 1) {
      testShows[i].userId = user._id;
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.createShow(testShows[i]);
    }
    let shows = await mapflixService.getAllShows();
    assert.equal(shows.length, testShows.length);
    await mapflixService.deleteAllShows();
    shows = await mapflixService.getAllShows();
    assert.equal(shows.length, 0);
  });

});
