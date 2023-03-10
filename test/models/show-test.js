import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testShows, testShow, testUser } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Show Model tests", () => {
  let user = null;

  setup(async () => {
    db.init("mongo");
    await db.showStore.deleteAll();
    user = await db.userStore.addUser(testUser);
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

  test("get shows belonging to user", async () => {
    await db.showStore.create({title: "test", userId: user._id})
    const userShows = await db.showStore.getCreatedByUser(user._id)
    assert.equal(userShows.length, 1)
    assert.equal(userShows[0].userId.str, user._id.str)
  })

  test("get shows belonging to user - bad params", async () => {
    assert.isNull(await db.showStore.getCreatedByUser());
    assert.isNull(await db.showStore.getCreatedByUser(""));
  })

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

  test("update show - success", async () => {
    const show = await db.showStore.create(testShow)
    const updatedShow = {...testShow}
    updatedShow.title = "Updated"
    await db.showStore.update(show, updatedShow);
    const returnedShow = await db.showStore.getById(show._id)
    assert.equal(returnedShow.title, "Updated")
  });

  test("update show - fail", async () => {
    await db.showStore.create(testShow)
    const updatedShow = {...testShow}
    updatedShow.title = "Updated"
    await db.showStore.update("invalid", updatedShow);
    const shows = await db.showStore.getAll();
    // users not updated
    shows.forEach((show) => {
      assert.notEqual(show.title, "Updated");
    })
  });

});
