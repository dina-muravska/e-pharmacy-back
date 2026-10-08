import Joi from 'joi';
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  password: Joi.string()
    .min(8)
    .max(110)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
