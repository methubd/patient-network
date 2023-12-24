import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required',
    }),
    password: z.string({ required_error: 'Password is required for login.' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required!.' }),
    newPassword: z.string({ required_error: 'Password is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required.' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    newPassword: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
