import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testReviews, testReview, testUser, testPoint, testShow } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Review Model Tests", () => {
  let user = null;
  let point = null;

  setup(async () => {
    db.init("mongo");
    await db.reviewStore.deleteAll();
    user = await db.userStore.addUser(testUser);
    const show = await db.showStore.create(testShow);
    point = await db.pointStore.create(show._id, testPoint)
    for (let i = 0; i < testReviews.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testReviews[i] = await db.reviewStore.create(testReviews[i]);
    }
  });

  test("get all reviews", async () => {
    const reviews = await db.reviewStore.getAll();
    assertSubset(testReviews, reviews)
  })

  test("get a review - success", async () => {
    const review = await db.reviewStore.create(testReview);
    const newReview = await db.reviewStore.getById(review._id);
    assertSubset(review, newReview);
  });

  test("get a review - bad params", async () => {
    assert.isNull(await db.reviewStore.getById());
    assert.isNull(await db.reviewStore.getById(""));
  });

  test("get reviews belonging to point", async () => {
    await db.reviewStore.create({ title: "test", body: "test", userId: user._id, pointId: point._id })
    const pointReviews = await db.reviewStore.getByPointId(point._id)
    assert.equal(pointReviews.length, 1)
    assert.equal(pointReviews[0].pointId.str, point._id.str)
  })

  test("get reviews belonging to point - bad params", async () => {
    assert.isNull(await db.reviewStore.getByPointId());
    assert.isNull(await db.reviewStore.getByPointId(""));
  })

  test("create a review", async () => {
    const review = await db.reviewStore.create(testReview);
    assertSubset(testReview, review);
    assert.isDefined(review._id);
  });

  test("delete all reviews", async () => {
    let allreviews = await db.reviewStore.getAll();
    assert.equal(allreviews.length, 2);
    await db.reviewStore.deleteAll();
    allreviews = await db.reviewStore.getAll();
    assert.equal(allreviews.length, 0);
  });


  test("delete one review - success", async () => {
    await db.reviewStore.delete(testReviews[0]._id);
    const reviews = await db.reviewStore.getAll();
    assert.equal(reviews.length, testReviews.length - 1);
    const deletedreview = await db.reviewStore.getById(testReviews[0]._id);
    assert.isNull(deletedreview);
  });

  test("delete one review - fail", async () => {
    await db.reviewStore.delete("invalid");
    const reviews = await db.reviewStore.getAll();
    assert.equal(reviews.length, testReviews.length);
  });

});
