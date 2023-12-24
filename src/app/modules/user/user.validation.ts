import Joi from 'joi';

export const userJoiValidationSchema = Joi.object({
  password: Joi.string().required().max(20).messages({
    'any.required': 'Password is required.',
    'string.max': 'Password must not exceed 20 characters.',
  }),
});
