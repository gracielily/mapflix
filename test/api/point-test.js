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
    console.log('hello')
    show = await mapflixService.createShow(testShow)
    console.log('bye')
  });

  teardown(async () => {});

  test("create point", async () => {
    const returnedPoint = await mapflixService.createPoint(show._id, testPoint);
    assertSubset(testPoint, returnedPoint);
  });

  test("create point - fail - bad data", async () => {
    try {
        await mapflixService.createPoint(show._id, {});
        assert.fail("Should return a 400");
    } catch(error){
        assert.equal(error.response.data.message, "Invalid request payload input");
    }
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
});
