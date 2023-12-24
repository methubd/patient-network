import { Schema, model } from 'mongoose';

import {
  Patient,
  GuardianInformation,
  PatientName,
  AttendentInformation,
  PatientStatic,
} from './patient.interface';

const patientNameSchema = new Schema<PatientName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required, Model Error!'],
    trim: true,
    maxlength: 10,
  },
  middleName: { type: String },
  lastName: { type: String, required: [true, 'Last Name is required!'] },
});

const guardianInformationSchema = new Schema<GuardianInformation>({
  name: { type: String, required: [true, 'Guardian Name is required!'] },
  relation: { type: String, required: [true, 'Relation is required!'] },
  address: { type: String, required: [true, 'Address is required!'] },
});

const attendentInformationSchema = new Schema<AttendentInformation>({
  name: { type: String, required: [true, 'Attendant Name is required!'] },
  relation: { type: String, required: [true, 'Relation is required!'] },
});

const patientSchema = new Schema<Patient, PatientStatic>(
  {
    id: {
      type: String,
      required: [true, 'Patient ID is required!'],
      unique: true,
    },
    name: {
      type: patientNameSchema,
      required: [true, 'Patient Name is required!'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female'],
        message: '{VALUE} is not supported, it would be Male or Female',
      },
      required: [true, 'Gender is required.'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number is required!'],
    },
    email: { type: String, required: [true, 'Email is required!'] },
    address: { type: String, required: [true, 'Address is required!'] },
    guardianInformation: {
      type: guardianInformationSchema,
      required: [true, 'Guardian Information is required!'],
    },
    attendentInformation: {
      type: attendentInformationSchema,
      required: [true, 'Attendant Information is required!'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

// document middleware
patientSchema.pre('save', async function (next) {
  const isUserExists = await PatientModel.findOne({ id: this.id });
  if (isUserExists) {
    throw new Error('User already exists!');
  }
  next();
});

// query middleware
patientSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

patientSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//aggregation query
patientSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Virtual
patientSchema.virtual('fullname').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

//static method
patientSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await PatientModel.findOne({ id });
  return existingUser;
};

export const PatientModel = model<Patient, PatientStatic>(
  'Patient',
  patientSchema,
);
