import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';

const createPatient = catchAsync(async (req, res) => {
  const { password, patient } = req.body;

  const result = await UserServices.createPatientToDB(password, patient);

  res.status(200).json({
    success: true,
    message: 'Successfully new patient added!',
    data: result,
  });
});

export const UserControllers = {
  createPatient,
};
