import { Model, Types } from 'mongoose';

export type PatientName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type GuardianInformation = {
  name: string;
  relation: string;
  address: string;
};

export type AttendentInformation = {
  name: string;
  relation: string;
};

export type Patient = {
  id: string;
  name: PatientName;
  user: Types.ObjectId;
  gender: 'Male' | 'Female';
  contactNo: string;
  email: string;
  address: string;
  guardianInformation: GuardianInformation;
  attendentInformation: AttendentInformation;
  isDeleted: boolean;
};

export interface PatientStatic extends Model<Patient> {
  isUserExists(id: string): Promise<Patient> | null;
}
