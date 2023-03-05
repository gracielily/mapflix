import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testShows, testShow } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Show Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.showStore.deleteAll();
    for (let i = 0; i < testShows.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testShows[i] = await db.showStore.create(testShows[i]);
    }
  });

  test("get a show - success", async () => {
    const show = await db.showStore.create(testShow);
    const newShow = await db.showStore.getById(show._id);
    assertSubset(show, newShow);
  });

  test("get a show - bad params", async () => {
    assert.isNull(await db.showStore.getById());
    assert.isNull(await db.showStore.getById(""));
  });

  test("create a show", async () => {
    const show = await db.showStore.create(testShow);
    assertSubset(testShow, show);
    assert.isDefined(show._id);
  });

  test("delete all shows", async () => {
    let allShows = await db.showStore.getAll();
    assert.equal(allShows.length, 2);
    await db.showStore.deleteAll();
    allShows = await db.showStore.getAll();
    assert.equal(allShows.length, 0);
  });


  test("delete one show - success", async () => {
    await db.showStore.delete(testShows[0]._id);
    const shows = await db.showStore.getAll();
    assert.equal(shows.length, testShows.length - 1);
    const deletedShow = await db.showStore.getById(testShows[0]._id);
    assert.isNull(deletedShow);
  });

  test("delete one show - fail", async () => {
    await db.showStore.delete("invalid");
    const shows = await db.showStore.getAll();
    assert.equal(shows.length, testShows.length);
  });
});
