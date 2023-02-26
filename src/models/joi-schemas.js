import Joi from "joi";

export const UserBaseSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}
export const UserSpec = {
  ...UserBaseSpec,
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
};