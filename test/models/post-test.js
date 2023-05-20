import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPosts, testPost, testUser } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Post Model Tests", () => {
  let user = null;

  setup(async () => {
    db.init("mongo");
    await db.postStore.deleteAll();
    user = await db.userStore.addUser(testUser);
    for (let i = 0; i < testPosts.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPosts[i] = await db.postStore.create(testPosts[i]);
    }
  });

  test("get all posts", async () => {
    const posts = await db.postStore.getAll();
    assertSubset(testPosts, posts)
  })

  test("get a post - success", async () => {
    const post = await db.postStore.create(testPost);
    const newpost = await db.postStore.getById(post._id);
    assertSubset(post, newpost);
  });

  test("get a post - bad params", async () => {
    assert.isNull(await db.postStore.getById());
    assert.isNull(await db.postStore.getById(""));
  });

  test("get posts belonging to user", async () => {
    await db.postStore.create({ title: "test", body: "test", userId: user._id })
    const userposts = await db.postStore.getByUserId(user._id)
    assert.equal(userposts.length, 1)
    assert.equal(userposts[0].userId.str, user._id.str)
  })

  test("get posts belonging to user - bad params", async () => {
    assert.isNull(await db.postStore.getByUserId());
    assert.isNull(await db.postStore.getByUserId(""));
  })

  test("create a post", async () => {
    const post = await db.postStore.create(testPost);
    assertSubset(testPost, post);
    assert.isDefined(post._id);
  });

  test("delete all posts", async () => {
    let allposts = await db.postStore.getAll();
    assert.equal(allposts.length, 2);
    await db.postStore.deleteAll();
    allposts = await db.postStore.getAll();
    assert.equal(allposts.length, 0);
  });


  test("delete one post - success", async () => {
    await db.postStore.delete(testPosts[0]._id);
    const posts = await db.postStore.getAll();
    assert.equal(posts.length, testPosts.length - 1);
    const deletedpost = await db.postStore.getById(testPosts[0]._id);
    assert.isNull(deletedpost);
  });

  test("delete one post - fail", async () => {
    await db.postStore.delete("invalid");
    const posts = await db.postStore.getAll();
    assert.equal(posts.length, testPosts.length);
  });

  test("update post - success", async () => {
    const post = await db.postStore.create(testPost)
    const updatedpost = { ...testPost }
    updatedpost.title = "Updated"
    await db.postStore.update(post, updatedpost);
    const returnedpost = await db.postStore.getById(post._id)
    assert.equal(returnedpost.title, "Updated")
  });

  test("update post - fail", async () => {
    await db.postStore.create(testPost)
    const updatedpost = { ...testPost }
    updatedpost.title = "Updated"
    await db.postStore.update("invalid", updatedpost);
    const posts = await db.postStore.getAll();
    // users not updated
    posts.forEach((post) => {
      assert.notEqual(post.title, "Updated");
    })
  });

});
