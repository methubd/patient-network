import Joi from 'joi';

const nameSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(10)
    .regex(/^[a-zA-Z]+$/, { name: 'alpha' })
    .message('{#label} must only contain alphabetic characters'),

  middleName: Joi.string(),

  lastName: Joi.string().required().label('Last Name'),
});

const guardianInformationSchema = Joi.object({
  name: Joi.string().required().label('Guardian Name'),
  relation: Joi.string().required().label('Relation'),
  address: Joi.string().required().label('Address'),
});

const attendentInformationSchema = Joi.object({
  name: Joi.string().required().label('Attendant Name'),
  relation: Joi.string().required().label('Relation'),
});

const createPatientJoiSchema = Joi.object({
  body: Joi.object({
    id: Joi.string().required().label('Patient ID'),

    name: nameSchema.required().label('Patient Name'),

    password: Joi.string().required(),

    gender: Joi.string()
      .valid('Male', 'Female')
      .required()
      .label('Gender')
      .messages({
        'any.only': '{#label} must be either Male or Female',
      }),

    contactNo: Joi.string().required().label('Contact Number'),

    email: Joi.string().email().required().label('Email'),

    address: Joi.string().required().label('Address'),

    guardianInformation: guardianInformationSchema
      .required()
      .label('Guardian Information'),

    attendentInformation: attendentInformationSchema
      .required()
      .label('Attendant Information'),
  }),
});

export const PatientJoiSchemas = {
  createPatientJoiSchema,
};
