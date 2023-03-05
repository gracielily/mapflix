import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPoints, testUsers, testShow, testPoint } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Point Model tests", () => {

  let show = null;

  setup(async () => {
    db.init("mongo");
    await db.pointStore.deleteAll();
    show = await db.showStore.create(testShow);
    for (let i = 0; i < testPoints.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPoints[i] = await db.pointStore.create(show._id, testPoints[i]);
    }
  });

  
  test("get point - success", async () => {
    const newShow = await db.showStore.create(testShow);
    const point = await db.pointStore.create(newShow._id, testPoint)
    const newPoint = await db.pointStore.getById(point._id);
    assert.equal(testPoint.name, newPoint.name)
  });

  test("get a point - bad params", async () => {
    assert.isNull(await db.pointStore.getById(""));
    assert.isNull(await db.pointStore.getById());
  });

  test("get points belonging to show - success", async () => {
    const newShow = await db.showStore.create(testShow);
    await db.pointStore.create(newShow._id, testPoint);
    const showPoints = await db.pointStore.getByShowId(newShow._id);
    showPoints.forEach(showPoint => {
      assert.equal(showPoint.showId.str, newShow._id.str)
    });
  });

  test("get points belonging to show - bad params", async () => {
    console.log(await db.pointStore.getByShowId(""))
    assert.isNull(await db.pointStore.getByShowId(""));
    assert.isNull(await db.pointStore.getByShowId());
  });

  test("create point", async () => {
    const newShow = await db.showStore.create(testShow);
    const point = await db.pointStore.create(newShow._id, testPoint)
    assert.isNotNull(point._id);
    assertSubset (testPoint, point);
  });


  test("delete all points", async () => {
    const points = await db.pointStore.getAll();
    assert.equal(testPoints.length, points.length);
    await db.pointStore.deleteAll();
    const curPoints = await db.pointStore.getAll();
    assert.equal(curPoints.length, 0);
  });

  test("delete one point - success", async () => {
    await db.pointStore.delete(testPoints[0]._id);
    const points = await db.pointStore.getAll();
    assert.equal(points.length, testPoints.length - 1);
    const deletedPoint = await db.pointStore.getById(testPoints[0]._id);
    assert.isNull(deletedPoint);
  });

  test("delete show also deletes points", async() => {
    const newShow = await db.showStore.create(testShow);
    const point = await db.pointStore.create(newShow._id, testPoint)
    await db.showStore.delete(newShow._id)
    assert.isNull(await db.pointStore.getById(point._id))
  })

  test("delete all shows also deletes points", async() => {
    const newShow = await db.showStore.create(testShow);
    const otherNewShow = await db.showStore.create(testShow);
    await db.pointStore.create(newShow._id, testPoint)
    await db.pointStore.create(otherNewShow._id, testPoint)
    await db.showStore.deleteAll();
    const deletedStores = await db.showStore.getAll()
    const deletedPoints = await db.pointStore.getAll()
    assert.equal(deletedStores.length, 0)
    assert.equal(deletedPoints.length, 0)
  })

  test("delete one point - fail", async () => {
    await db.pointStore.delete("invalid");
    const points = await db.pointStore.getAll();
    // point not deleted
    assert.equal(points.length, testPoints.length);
  });


});
