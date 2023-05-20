import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testComments, testComment, testUser, testPost } from "../fixtures.js";
import { assertSubset } from "../utils.js";

suite("Comment Model Tests", () => {
  let user = null;

  setup(async () => {
    db.init("mongo");
    await db.commentStore.deleteAll();
    user = await db.userStore.addUser(testUser);
    for (let i = 0; i < testComments.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testComments[i] = await db.commentStore.create(testComments[i]);
    }
  });

  
  test("get all comments", async () => {
    const comments = await db.commentStore.getAll();
    assertSubset(testComments, comments)
  })

  test("get a Comment - success", async () => {
    const comment = await db.commentStore.create(testComment);
    const newComment = await db.commentStore.getById(comment._id);
    assertSubset(comment, newComment);
  });

  test("get a Comment - bad params", async () => {
    assert.isNull(await db.commentStore.getById());
    assert.isNull(await db.commentStore.getById(""));
  });

  test("get Comments belonging to post", async () => {
    const post = await db.postStore.create(testPost);
    await db.commentStore.create({ title: "test", body: "test", userId: user._id, postId: post._id })
    const userComments = await db.commentStore.getAllForPost(post._id)
    assert.equal(userComments.length, 1)
    assert.equal(userComments[0].userId.str, user._id.str)
  })

  test("get Comments belonging to post - bad params", async () => {
    assert.isNull(await db.commentStore.getAllForPost());
    assert.isNull(await db.commentStore.getAllForPost(""));
  })

  test("create a Comment", async () => {
    const Comment = await db.commentStore.create(testComment);
    assertSubset(testComment, Comment);
    assert.isDefined(Comment._id);
  });

  test("delete all Comments", async () => {
    await db.commentStore.deleteAll();
    const allComments = await db.commentStore.getAll();
    assert.equal(allComments.length, 0);
  });


  test("delete one Comment - success", async () => {
    await db.commentStore.delete(testComments[0]._id);
    const Comments = await db.commentStore.getAll();
    assert.equal(Comments.length, testComments.length - 1);
    const deletedComment = await db.commentStore.getById(testComments[0]._id);
    assert.isNull(deletedComment);
  });

  test("delete one Comment - fail", async () => {
    await db.commentStore.delete("invalid");
    const Comments = await db.commentStore.getAll();
    assert.equal(Comments.length, testComments.length);
  });

});
