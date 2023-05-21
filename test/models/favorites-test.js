import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testUser } from "../fixtures.js";

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

  test("adds and removes point from favorites", async () => {
    const favorites = await db.favoritesStore.getOrCreateByUser(user._id);
    await db.favoritesStore.addPointToFavorites(favorites, "point-id-123");
    const addedFavorites = await db.favoritesStore.getOrCreateByUser(user._id);
    assert.equal(addedFavorites.points.length, 1);
    await db.favoritesStore.removePointFromFavorites(addedFavorites, "point-id-123");
    const removedFavorites = await db.favoritesStore.getOrCreateByUser(user._id);
    assert.equal(removedFavorites.points.length, 0);
  });

});
