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