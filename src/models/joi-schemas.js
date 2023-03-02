import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserBaseSpec = Joi.object().keys({
  email: Joi.string().email().example("janedoe@example.com").required(),
  password: Joi.string().example("somepassword123").required(),
}).label("Credentials")

export const UserSpec = UserBaseSpec.keys({
  firstName: Joi.string().example("Jane").required(),
  lastName: Joi.string().example("Doe").required(),
}).label("User Details");

export const UserSpecExtra = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("UserDetailsExtra");

export const UserArray = Joi.array().items(UserSpecExtra).label("UserArray");


export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJIUzR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMtZSIaWF0IjoxNTE2MjM5MDIyfQ.SflKxT4fwp_adQssw5c").required(),
  })
  .label("JwtAuth");
