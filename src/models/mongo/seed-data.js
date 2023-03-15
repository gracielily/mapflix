export const seedData = {
  users: {
    _model: "User",
    user1: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@doe.com",
      password: "password123",
      avatar: "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/xmj8lidyulylcyhbl90o.jpg"
    },
    user2: {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "somesecret",
      isAdmin: true,
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
      latitude: 52.38877,
      longitude: -6.361969,
      publicTransport: true,
      wheelchairAccessible: false,
      facilitiesAvailable: true,
      images: ["http://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/zwj4nxt6y40ma4kxsm0t.jpg","https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/hinc0qy4u2zxmawztx5i.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/EUCYkYZXkAMhahj_bncia2.jpg"],
      showId: "->shows.show1"
    },
    point2: {
      name: "Curracloe Beach",
      description: "This is the beach where Ellis meets with Jim and her friends",
      latitude: 52.38877,
      longitude: -6.361969,
      publicTransport: true,
      wheelchairAccessible: false,
      facilitiesAvailable: true,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/ouja2py42wbeldjvfbfn.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/2015-BROOKLYN-009_k3ap1e.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/04BROOKLYNJP-jumbo_m7p86z.jpg"],
      showId: "->shows.show2"
    },
    point3: {
      name: "St Fintan's Church",
      description: "This where is Ellis attends mass with Miss Kelly.",
      latitude: 52.349356,
      longitude: -6.660543,
      publicTransport: false,
      wheelchairAccessible: true,
      facilitiesAvailable: false,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/15615002_20.jpg_hcc2py.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/1-1-dsc_0607_u67qin.jpg"],
      showId: "->shows.show2"
    },
  }
};