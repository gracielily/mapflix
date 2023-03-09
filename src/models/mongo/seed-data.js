export const seedData = {
    users: {
      _model: "User",
      user1: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@doe.com",
        password: "password123",
        isAdmin: true,
      },
      user2: {
        firstName: "John",
        lastName: "Doe",
        email: "john@doe.com",
        password: "somesecret"
      },
    },
    shows: {
      _model: "Show",
      show1: {
        title: "Saving Private Ryan",
        imdbId: "tt0120815",
        userId: "->users.user1"
      }
    },
    points: {
      _model: "Point",
      point1: {
        name: "Curracloe Beach",
        description: "This beach was famously used in the filming of the D-Day landng scenes of the 1997 film.",
        location: {
          latitude: 52.38,
          longitude: -6.36,
        },
        features: {
          publicTransport: true,
          wheelchairAccessible: false,
          facilitiesAvailable: true,
        },
        showId: "->shows.show1"
      }
    }
  };
  