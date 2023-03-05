import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserBaseSpec = Joi.object().keys({
  email: Joi.string().email().required().example("janedoe@example.com"),
  password: Joi.string().required().example("somepassword123"),
}).label("Credentials")

export const UserSpec = UserBaseSpec.keys({
  firstName: Joi.string().required().example("Jane"),
  lastName: Joi.string().required().example("Doe"),
}).label("User Details");

export const UserSpecExtra = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("UserDetailsExtra");

export const UserArray = Joi.array().items(UserSpecExtra).label("UserArray");

export const PointSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("Raven Point"),
    location: Joi.object().keys({
      latitude: Joi.number().required().example(8472.29302),
      longitude: Joi.number().required().example(79813.31),
    }).required(),
    dateAdded: Joi.date(),
    features: Joi.object().keys({
      publicTransport: Joi.bool().example(false),
      wheelchairAccessible: Joi.bool().example(true),
      facilitiesAvailable: Joi.bool().example(true),
    }),
    showId: IdSpec,
  })
  .label("Point Details");

export const PointSpecExtra = PointSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PointDetailsExtra");

export const PointArraySpec = Joi.array().items(PointSpecExtra).label("PointArray");

export const ShowSpec = Joi.object().keys({
  title: Joi.string().required().example("Braveheart"),
  imdbId: Joi.string().regex(/(tt[0-9]*)/).required().example("tt0112573"),
  userId: IdSpec,
  points: PointArraySpec,
  dateAdded: Joi.date(),
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
