import { Request, Response } from 'express';
import { PatientServices } from './patient.service';
import catchAsync from '../../utils/catchAsync';

const getAllPatient = catchAsync(async (req, res) => {
  const result = await PatientServices.getAllPatientFromDB();

  if (result.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No Patient Found!',
    });
  }
  res.status(200).json({
    success: true,
    message: 'Patients is retrieved Successfully!',
    data: result,
  });
});

const getSinglePatient = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PatientServices.getSinglePatientFromDB(id);
  res.status(200).json({
    success: true,
    message: 'Single Patient Retrieved!',
    data: result,
  });
});

const updatePatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PatientServices.updatePatientIntoDB(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Successfully updated!',
    data: result,
  });
};

const deletePatient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PatientServices.deletePatientFromDB(id);
  res.status(200).json({
    success: true,
    message: 'Successfully deleted!',
    data: result,
  });
};

export const PatientController = {
  getAllPatient,
  getSinglePatient,
  updatePatient,
  deletePatient,
};
