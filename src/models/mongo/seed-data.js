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
      userId: "->users.user1",
      image: "http://res.cloudinary.com/dcjnywjjk/image/upload/v1678641198/jhubuq2csxvn7yonpae6.jpg",
    },
    show2: {
      title: "Brooklyn",
      imdbId: "tt2381111",
      userId: "->users.user1",
      image: "http://res.cloudinary.com/dcjnywjjk/image/upload/v1678641854/zxlfi0x3pzie1thlcuyx.jpg",
    },
    show3: {
      title: "The Banshees of Inisherin",
      imdbId: "tt11813216",
      userId: "->users.user1",
      image: "http://res.cloudinary.com/dcjnywjjk/image/upload/v1678641836/fq7htqvitgbf4oj9m14p.webp",
    },
    show4: {
      title: "The Wind that Shakes the Barley",
      imdbId: "tt0460989",
      userId: "->users.user1",
      image: "http://res.cloudinary.com/dcjnywjjk/image/upload/v1678641870/wzebn0q73rzdqs0hnb5e.jpg",
    }
  },
  points: {
    _model: "Point",
    point1: {
      name: "Curracloe Beach",
      description: "This beach was famously used in the filming of the D-Day landng scenes of the 1997 film.",
      latitude: 52,
      longitude: 6,
      publicTransport: true,
      wheelchairAccessible: false,
      facilitiesAvailable: true,
      images: ["http://res.cloudinary.com/dcjnywjjk/image/upload/v1678641097/firbrrfz4d7dcp814tln.jpg"],
      showId: "->shows.show1"
    }
  }
};