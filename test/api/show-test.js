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
    testShow.userId = user._id;
  });

  teardown(async () => { });

  test("create show - success", async () => {
    const createdShow = await mapflixService.createShow({ title: "test movie", imdbId: "tt839038" });
    assert.isNotNull(createdShow);
    assertSubset(createdShow, testShow);
  });

  test("create show - bad payload", async () => {
    try {
      // invalid imdbId
      await mapflixService.createShow({ title: "test movie", imdbId: "t839038" });
      assert.fail("Should return a 400");
    } catch (error) {
      assert.equal(error.response.status, 400);
      assert.equal(error.response.data.message, "Invalid request payload input");
    }
  });

  test("delete a show - success", async () => {
    const show = await mapflixService.createShow({ title: "test movie", imdbId: "tt839038" });
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
    await mapflixService.createShow({ title: "test movie", imdbId: "tt839038" });
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

  test("delete all shows", async () => {
    await mapflixService.createShow(testShow);
    const shows = await mapflixService.getAllShows();
    assert.equal(shows.length, 1);
    await mapflixService.deleteAllShows();
    const showsAfterDelete = await mapflixService.getAllShows();
    assert.equal(showsAfterDelete.length, 0);
  })

  test("create multiple shows", async () => {
    for (let i = 0; i < testShows.length; i += 1) {
      testShows[i].userId = user._id;
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.createShow(testShows[i]);
    }
    const shows = await mapflixService.getAllShows();
    assert.equal(shows.length, testShows.length);
  });


  test("Get all Shows - Success", async () => {
    await mapflixService.createShow(testShow);
    const shows = await mapflixService.getAllShows();
    assert.equal(shows.length, 1);
    assert.equal(shows[0].title, testShow.title);
  });

  test("Get all Shows - Success - Empty Response", async () => {
    const shows = await mapflixService.getAllShows();
    assert.equal(shows.length, 0);
  });

  test("Search show - Success", async () => {
    await mapflixService.createShow(testShow);
    const shows = await mapflixService.searchForShow("search", testShow.title.slice(0, 3));
    assert.equal(shows.length, 1);
    assert.equal(shows[0].title, testShow.title);
  });

  test("Search show - Success - Empty Response", async () => {
    await mapflixService.createShow(testShow);
    const shows = await mapflixService.searchForShow("search", "hjkhkjhkjhk");
    assert.equal(shows.length, 0);
  });

  test("Search show - Fail - invalid query", async () => {
    await mapflixService.createShow(testShow);
    try {
      await mapflixService.searchForShow("invalid", "hjkhkjhkjhk");
      assert.fail("raise a 400")
    } catch (error) {
      assert.equal(error.response.data.statusCode, 400)
      assert.equal(error.response.data.message, "Invalid request query input")
    }
  });

  test("Gets a Show - Success", async () => {
    const show = await mapflixService.createShow(testShow);
    const returnedShow = await mapflixService.getShow(show._id);
    assertSubset(testShow, returnedShow);
  });

  test("Gets a Show - Invalid Id", async () => {
    try {
      await mapflixService.getShow("invalid");
      assert.fail("should not return a show");
    } catch (error) {
      assert.equal(error.response.data.message, "No Show found with this ID");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("Get Show - show deleted", async () => {
    const show = await mapflixService.createShow(testShow);
    await mapflixService.deleteAllShows();
    try {
      await mapflixService.getShow(show._id);
      assert.fail("Should not return a show");
    } catch (error) {
      assert.equal(error.response.data.message, "Not Found.");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

});
