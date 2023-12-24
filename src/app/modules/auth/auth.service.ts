import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import createToken from './auth.utils';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUserIntoDB = async (payload: TLoginUser) => {
  const existingUser = await UserModel.findOne({ id: payload?.id });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Use not found');
  }
  // checking is deleted or not
  const isDeleted = existingUser.isDeleted === true;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already deleted');
  }

  // checking is blocked or not
  const status = existingUser.status === 'blocked';
  if (status) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //checking is password matched or not
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    existingUser?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // Access granted: Send AccessToken, Refresh Token
  const jwtPayload = {
    id: existingUser?.id,
    role: existingUser?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_token_secret as string,
    config.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChanged: existingUser?.needsPasswordChange,
  };
};

const changePasswordFromDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const existingUser = await UserModel.findOne({ id: userData?.id });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Use not found');
  }
  // checking is deleted or not
  const isDeleted = existingUser.isDeleted === true;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already deleted');
  }

  // checking is blocked or not
  const status = existingUser.status === 'blocked';
  if (status) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //checking password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    existingUser?.password,
  );

  if (!(await isPasswordMatched)) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password do not matched!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bicrypt_salt_rount),
  );

  //setting new password into db
  await UserModel.findOneAndUpdate(
    {
      id: userData?.id,
      role: userData?.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChanged: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshTokenFromDB = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.refresh_token_secret as string,
  ) as JwtPayload;

  const { id, iat } = decoded;

  const existingUser = await UserModel.findOne({ id });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // checking is deleted or not
  const isDeleted = existingUser.isDeleted === true;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already deleted');
  }

  // checking is blocked or not
  const status = existingUser.status === 'blocked';
  if (status) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //if password changedAt and ...
  if (
    existingUser.passwordChangedAt &&
    UserModel.isJWTIssuedAfterBeforePasswordChanged(
      existingUser.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized!');
  }

  // if (existingUser.passwordChangedAt)
  // Access granted: Send AccessToken, Refresh Token
  const jwtPayload = {
    id: existingUser?.id,
    role: existingUser?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    config.access_token_expires_in as string,
  );

  return { accessToken };
};

const forgetPasswordToDB = async (id: string) => {
  const existingUser = await UserModel.findOne({ id });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Use not found');
  }
  // checking is deleted or not
  const isDeleted = existingUser.isDeleted === true;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already deleted');
  }

  // checking is blocked or not
  const status = existingUser.status === 'blocked';
  if (status) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  // Access granted: Send AccessToken, Refresh Token
  const jwtPayload = {
    id: existingUser?.id,
    role: existingUser?.role,
  };

  // creating reset token
  const resetToken = createToken(
    jwtPayload,
    config.access_token_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?userId=${existingUser?.id}&token=${resetToken}`;
  sendEmail(existingUser?.email, resetUILink);
};

const resetPasswordFromDB = async (
  payload: {
    id: string;
    newPassword: string;
  },
  token: string,
) => {
  const existingUser = await UserModel.findOne({ id: payload?.id });

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Use not found');
  }
  // checking is deleted or not
  const isDeleted = existingUser.isDeleted === true;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Already deleted');
    return;
  }

  // checking is blocked or not
  const status = existingUser.status === 'blocked';
  if (status) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
  }

  //checking if the token is valid or not - from decoding
  const decoded = jwt.verify(
    token,
    config.access_token_secret as string,
  ) as JwtPayload;

  //hash the new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bicrypt_salt_rount),
  );

  await UserModel.updateOne(
    {
      id: decoded?.id,
      role: decoded?.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

export const AuthServices = {
  loginUserIntoDB,
  changePasswordFromDB,
  refreshTokenFromDB,
  forgetPasswordToDB,
  resetPasswordFromDB,
};
