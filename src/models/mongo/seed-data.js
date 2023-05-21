export const seedData = {
  users: {
    _model: "User",
    user1: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@doe.com",
      password: "$2a$10$XrOtzz0ftaoCraUkm.qCguqVuXjZewp8suJEEDQXIroOYAybypm5e", //Passw0rd?123
      avatar: "https://res.cloudinary.com/dcjnywjjk/image/upload/v1684169410/gavkzrsrege1dlh5won6.jpg"
    },
    user2: {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "$2a$10$zKvpwdlBM/VFQQf8cfgg3u4ENKbS1jEIxKl.jH/b.gCXWshgIX5mO", //S0m3secrEt!
      isAdmin: true,
      avatar: "https://res.cloudinary.com/dcjnywjjk/image/upload/v1677767178/sample.jpg"
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
    },
    show5: {
      title: "Braveheart",
      imdbId: "tt0112573",
      userId: "->users.user2",
      image: "https://res.cloudinary.com/dcjnywjjk/image/upload/v1682943036/iy9bal2oxsqriv0wq6tc.jpg",
    },
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
      showId: "->shows.show1",
      isPublic: true,
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
      showId: "->shows.show2",
      isPublic: true,
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
      showId: "->shows.show2",
      isPublic: true,
    },
    point4: {
      name: "The Athenaeum Enniscorthy",
      description: "The scenes where Eilis and her best friend Nancy (Eileen O'Higgins) go to the dance in Enniscorthy were filmed at the Athenaeum",
      latitude: 52.501613,
      longitude: -6.568052597,
      publicTransport: true,
      wheelchairAccessible: true,
      facilitiesAvailable: true,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/2423_apdpx2.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/68720-To-the-party-_swigki.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/b_155_b_05242_2k3a8246_u7zzbz.jpg"],
      showId: "->shows.show2",
      isPublic: false,
    },
    point5: {
      name: "Cloughmore",
      description: "Cloughmore, on the south-eastern corner of Achill Island, was the setting for JJ Devines pub. The building was constructed by the film crew and later removed. It is where Colin Farrell and Brendan Gleeson's characters talk at a wooden table outside the pub.",
      latitude: 53.878074,
      longitude: -9.966217,
      publicTransport: false,
      wheelchairAccessible: true,
      facilitiesAvailable: false,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/4300506114_ebdc5f3b8c_c_qlkqqi.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/33333_vsmxdx.jpg"],
      showId: "->shows.show3",
      isPublic: false,
    },
    point6: {
      name: "Keem Bay",
      description: "Keem Bay, home to one of Ireland's most popular beaches, is the location for the home of Brendan Gleeson's character Colm Doherty.",
      latitude: 53.96931758,
      longitude: -10.1941277,
      publicTransport: true,
      wheelchairAccessible: false,
      facilitiesAvailable: false,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/jjdevines_construction_800_a2zl2j.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/keem_bay_waw_sign_cottage_zg71dr.jpg", "https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/keem_bay_fiddle_1-1_p823kc.jpg"],
      showId: "->shows.show3",
      isPublic: true,
    },
    point7: {
      name: "Bective Abbey",
      description: "Braveheart was filmed in Scotland and Ireland. Additional filming took place at Ardmore Studios in County Wicklow, Ireland.",
      latitude: 53.582436,
      longitude: -6.702951,
      publicTransport: true,
      wheelchairAccessible: false,
      facilitiesAvailable: false,
      images: ["https://res.cloudinary.com/dcjnywjjk/image/upload/v1678905997/jjdevines_construction_800_a2zl2j.jpg"],
      showId: "->shows.show5",
      isPublic: true,
    },
  },
  posts: {
    _model: "Post",
    post1: {
      title: "Post 1",
      body: "This is a post",
      userId: "->users.user1"
    }
  },
  comments: {
    _model: "Comment",
    comment1: {
      postId: "->posts.post1",
      userId: "->users.user2",
      body: "This is a comment"
    }
  }
};