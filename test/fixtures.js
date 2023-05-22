import * as dotenv from "dotenv";

dotenv.config()

export const testUserCredentials = {
  email: "jane@doe.com",
  password: "password123",
}

export const testUser = {
  ...testUserCredentials,
  firstName: "Jane",
  lastName: "Doe",
  isAdmin: false,
};

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
    isAdmin: true,
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
    isAdmin: false,
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
    isAdmin: false,
  }
];

export const url = process.env.SERVICE_URL;

export const testPoints = [{
  name: "The Raven", 
  latitude: 41.412,
  longitude: 100.8529,
  description: "Scene filmed here",
}]

export const testShow = { title: "test movie", imdbId: "tt839038" }

export const testPoint = {
  name: "Wexford Town",
  latitude: 41.412,
  longitude: 100.8529,
  description: "Where the movie was filmed.",
}

export const testShows = [
  { title: "The Wind That Shakes the Barley", imdbId: "tt98780923" },
  { title: "Braveheart", imdbId: "tt464e634" }
]

export const testPost = { title: "Post 1", body: "Post Body 1"}

export const testPosts = [
  { title: "Post A", body: "Post Body A"},
  { title: "Post B", body: "Post Body B"},
]

export const testComment = { body: "Comment Body 1"}

export const testComments = [
  { body: "Comment Body A"},
  { body: "Comment Body B"},
]

export const testReview = { commentTitle: "Review Title 1", commentBody: "Review Body 1", rating: 4}

export const testReviews = [
  { commentTitle: "Review Title A", commentBody: "Review Body A", rating: 2},
  { commentTitle: "Review Title B", commentBody: "Review Body B", rating: 5}
]