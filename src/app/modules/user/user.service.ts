import mongoose from 'mongoose';
import config from '../../config';
import { Patient } from '../patient/patient.interface';
import { PatientModel } from '../patient/patient.model';
import { User } from './user.interface';
import { UserModel } from './user.model';
import generatePatientId from './user.utils';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const createPatientToDB = async (password: string, payload: Patient) => {
  //create a user object
  const userData: Partial<User> = {};

  //if user not give a password
  userData.password = password || (config.default_password as string);

  //set default user role
  userData.role = 'patient';
  userData.email = payload?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set generated id
    userData.id = await generatePatientId(payload);

    // creating new user (transaction - 1)
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //refference id

    //create a new patient (transaction - 2)
    const newPatient = await PatientModel.create([payload], { session });

    if (!newPatient.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create patient');
    }

    await session.commitTransaction();
    await session.endSession();

    return newPatient;
  } catch (err: any) {
    session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createPatientToDB,
};
