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

export const url = "http://localhost:3000";

export const testPoints = [{name: "The Raven"}]

export const testShow = {
  title: "Brooklyn",
  imdbId: "tt83829",
}

export const testPoint = {
  name: "Wexford Town",
}

export const testShows = [
  {title: "The Wind That Shakes the Barley", imdbId: "tt98780923"},
  {title: "Braveheart", imdbId: "tt464e634"}
]