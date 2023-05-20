import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testComments, testComment, testUser, testPost } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Favorites Model Tests", () => {
    let user = null;
  setup(async () => {
    db.init("mongo");
    await db.favoritesStore.deleteAll();
    user = await db.userStore.addUser(testUser);
  });

  
  test("creates and gets favorites", async () => {
    const favorites = await db.favoritesStore.getOrCreateByUser(user._id);
    assert.equal(favorites.points.length, 0);
  })

  test("adds point to favorites", async () => {
    const favorites = await db.favoritesStore.getOrCreateByUser(user._id);
    await db.favoritesStore.addPointToFavorites(favorites, "point-id-123");
    const updatedFavorites = await db.favoritesStore.getOrCreateByUser(user._id);
    assert.equal(updatedFavorites.points.length, 1);
    assert.equal(favorites.points[0], "point-id-123");
  });

  test("removes points from favorites", async () => {
    const favorites = await db.favoritesStore.getOrCreateByUser(user._id);
    await db.favoritesStore.addPointToFavorites(favorites, "point-id-123");
    await db.favoritesStore.removePointFromFavorites(favorites, "point-id-123");
    const updatedFavorites = await db.favoritesStore.getOrCreateByUser(user._id);
    assert.equal(updatedFavorites.points.length, 0);
  });

});
