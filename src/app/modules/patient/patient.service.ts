import { Patient } from './patient.interface';
import { PatientModel } from './patient.model';

const getAllPatientFromDB = async () => {
  const result = await PatientModel.find();
  return result;
};

const getSinglePatientFromDB = async (id: string) => {
  if (!(await PatientModel.isUserExists(id))) {
    throw new Error('User not found!');
  }
  const result = await PatientModel.findOne({ id }).populate('user');
  return result;
};

const updatePatientIntoDB = async (id: string, payload: Partial<Patient>) => {
  console.log(id);

  if (!(await PatientModel.isUserExists(id))) {
    return `No mathced for this id - ${id}`;
  }

  const {
    name,
    guardianInformation,
    attendentInformation,
    ...remainingPatientData
  } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingPatientData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  if (guardianInformation && Object.keys(guardianInformation).length) {
    for (const [key, value] of Object.entries(guardianInformation)) {
      modifiedUpdateData[`guardianInformation.${key}`] = value;
    }
  }

  if (attendentInformation && Object.keys(attendentInformation).length) {
    for (const [key, value] of Object.entries(attendentInformation)) {
      modifiedUpdateData[`attendentInformation.${key}`] = value;
    }
  }

  const result = await PatientModel.findOneAndUpdate(
    { id },
    modifiedUpdateData,
    { new: true, runValidators: true },
  );
  return result;
};

const deletePatientFromDB = async (id: string) => {
  const result = await PatientModel.updateOne({ id: id }, { isDeleted: true });
  return result;
};

export const PatientServices = {
  getAllPatientFromDB,
  getSinglePatientFromDB,
  updatePatientIntoDB,
  deletePatientFromDB,
};
