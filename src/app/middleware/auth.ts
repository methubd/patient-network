import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    //if the token is not sent
    const decoded = jwt.verify(
      token,
      config.access_token_secret as string,
    ) as JwtPayload;

    const { role, id, iat } = decoded;

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

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized.');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
