import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDB(req.body);
  const { refreshToken, accessToken, needsPasswordChanged } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Successfully Logged In',
    data: {
      accessToken,
      needsPasswordChanged,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  // console.log(req.user, req.body, 'controller');
  const { ...passowrdData } = req.body;
  const result = await AuthServices.changePasswordFromDB(
    req.user,
    passowrdData,
  );

  res.status(200).json({
    success: true,
    message: 'Successfully Password Changed!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenFromDB(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Refresh token is given successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const id = req.body.id;
  const result = await AuthServices.forgetPasswordToDB(id);

  res.status(200).json({
    success: true,
    message: 'Forget link sent on your email!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = AuthServices.resetPasswordFromDB(req.body, token);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
