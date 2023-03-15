import { assert } from "chai";
import { mapflixService } from "./mapflix-service.js";
import { assertSubset } from "../utils.js";
import { testUser, testUserCredentials, testShow, testPoint, testPoints } from "../fixtures.js";

suite("Point API tests", () => {
  let user = null;
  let show = null;

  setup(async () => {
    mapflixService.clearAuth();
    user = await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUserCredentials);
    await mapflixService.deleteAllUsers();
    user = await mapflixService.createUser(testUser);
    await mapflixService.authenticate(testUserCredentials);
    testShow.userId = user._id;
    show = await mapflixService.createShow(testShow)
  });

  teardown(async () => { });

  test("create point", async () => {
    const returnedPoint = await mapflixService.createPoint(show._id, testPoint);
    assertSubset(testPoint, returnedPoint);
  });

  test("create multiple points", async () => {
    for (let i = 0; i < testPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.createPoint(show._id, testPoints[i]);
    }
    const returnedPoints = await mapflixService.getAllPoints();
    assert.equal(returnedPoints.length, testPoints.length);
    for (let i = 0; i < returnedPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const point = await mapflixService.getPoint(returnedPoints[i]._id);
      assertSubset(point, returnedPoints[i]);
    }
  });

  test("create point - fail - bad data", async () => {
    try {
      await mapflixService.createPoint(show._id, {});
      assert.fail("Should return a 400");
    } catch (error) {
      assert.equal(error.response.data.message, "Invalid request payload input");
    }
  });

  test("Delete a point - success", async () => {
    for (let i = 0; i < testPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.createPoint(show._id, testPoints[i]);
    }
    let returnedPoints = await mapflixService.getAllPoints();
    assert.equal(returnedPoints.length, testPoints.length);
    for (let i = 0; i < returnedPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.deletePoint(returnedPoints[i]._id);
    }
    returnedPoints = await mapflixService.getAllPoints();
    assert.equal(returnedPoints.length, 0);
  });


  test("Delete a point - fail", async () => {
    const pointsBeforeDelete = await mapflixService.getAllPoints();
    try {
      await mapflixService.deletePoint("invalid");
      assert.fail("this should fail")
    } catch {
      const pointsAfterDelete = await mapflixService.getAllPoints();
      // point not deleted
      assert.equal(pointsBeforeDelete.length, pointsAfterDelete.length);
    }
  });

  test("denormalised show", async () => {
    for (let i = 0; i < testPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await mapflixService.createPoint(show._id, testPoints[i]);
    }
    const returnedShow = await mapflixService.getShow(show._id);
    assert.equal(returnedShow.points.length, testPoints.length);
    for (let i = 0; i < testPoints.length; i += 1) {
      assertSubset(testPoints[i], returnedShow.points[i]);
    }
  });

  test("Get all Points - Success", async () => {
    await mapflixService.createPoint(show._id, testPoint);
    const points = await mapflixService.getAllPoints();
    assert.equal(points.length, 1);
    assert.equal(points[0].name, testPoint.name);
  });

  test("Get all Points - Success - Empty Response", async () => {
    const points = await mapflixService.getAllPoints();
    assert.equal(points.length, 0);
  });

  test("Gets a Point - Success", async () => {
    const point = await mapflixService.createPoint(show._id, testPoint);
    const returnedPoint = await mapflixService.getPoint(point._id);
    assertSubset(testPoint, returnedPoint);
  });

  test("Gets a Point - Invalid Id", async () => {
    try {
      await mapflixService.getPoint("invalid");
      assert.fail("should not return a show");
    } catch (error) {
      assert.equal(error.response.data.message, "No Point found with this ID");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("Deletes all points and returns not found when getting point", async () => {
    const point = await mapflixService.createPoint(show._id, testPoint);
    // delete all points
    await mapflixService.deleteAllPoints();
    try {
      await mapflixService.getPoint(point._id);
      assert.fail("Should not return a point");
    } catch (error) {
      assert.equal(error.response.data.message, "Not Found.");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("Gets a Point - Show Deleted", async () => {
    const point = await mapflixService.createPoint(show._id, testPoint);
    await mapflixService.deleteAllShows();
    try {
      await mapflixService.getPoint(point._id);
      assert.fail("Should not return a point");
    } catch (error) {
      assert.equal(error.response.data.message, "Not Found.");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

});
