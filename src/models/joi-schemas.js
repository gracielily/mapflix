import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserBaseSpec = Joi.object().keys({
  email: Joi.string().email().required().example("janedoe@example.com"),
  password: Joi.string().required().example("somepassword123"),
}).label("Credentials")

export const UserSpec = UserBaseSpec.keys({
  firstName: Joi.string().required().example("Jane"),
  lastName: Joi.string().required().example("Doe"),
  avatar: Joi.string(),
}).label("User Details");

export const UserSpecExtra = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("UserDetailsExtra");

export const UserArray = Joi.array().items(UserSpecExtra).label("UserArray");

export const PointSpec = Joi.object().keys({
    name: Joi.string().required().example("Raven Point"),
    description: Joi.string().required().example("Where the iconic scene was filmed"),
    latitude: Joi.number().greater(-85).less(85).messages({ "latitude": "Invalid latitude!" }).required().example(84),
    longitude: Joi.number().greater(-180).less(180).messages({ "longitude": "Invalid longitude!" }).required().required().example(22),
    dateAdded: Joi.date(),
    images: Joi.array().items(Joi.string()),
    publicTransport: Joi.boolean().example("false"),
    wheelchairAccessible: Joi.boolean().example("true"),
    facilitiesAvailable: Joi.boolean().example("true"),
  }).label("Point Details");

export const PointSpecExtra = PointSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
  showId: IdSpec,
}).label("PointDetailsExtra");

export const PointArraySpec = Joi.array().items(PointSpecExtra).label("PointArray");

export const ShowSpec = Joi.object().keys({
  title: Joi.string().required().example("Braveheart"),
  imdbId: Joi.string().regex(/(tt[0-9]*)/).required().example("tt0112573"),
  userId: IdSpec,
  points: PointArraySpec,
  dateAdded: Joi.date(),
  image: Joi.string(),
}).label("Show Details")

export const ShowSpecExtra = ShowSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("ShowDetailsExtra");

export const ShowArraySpec = Joi.array().items(ShowSpecExtra).label("ShowArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().required().example("true"),
    token: Joi.string().required().example("eyJhbGciOiJIUzR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMtZSIaWF0IjoxNTE2MjM5MDIyfQ.SflKxT4fwp_adQssw5c"),
  })
  .label("JwtAuth");

export const ShowSearchTermSpec = Joi.object({search: Joi.string().optional().allow("")});