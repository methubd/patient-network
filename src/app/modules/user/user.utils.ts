import { Patient } from '../patient/patient.interface';
import { UserModel } from './user.model';

const findLastPatientId = async () => {
  const lastPatient = await UserModel.findOne(
    { role: 'patient' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastPatient?.id ? lastPatient.id.substring(6) : undefined;
};

const generatePatientId = async (payload: Patient) => {
  const currentId = (await findLastPatientId()) || (0).toString();
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `RSH${payload.contactNo.slice(9, 11)}${incrementId}`;
  return incrementId;
};

export default generatePatientId;
