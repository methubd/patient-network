import { z } from 'zod';

const nameSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'First Name must start with a capital letter',
    }),
  middleName: z.string(),
  lastName: z.string(),
});

const guardianInformationSchema = z.object({
  name: z.string(),
  relation: z.string(),
  address: z.string(),
});

const attendentInformationSchema = z.object({
  name: z.string(),
  relation: z.string(),
});

const createPatientValidationSchema = z.object({
  body: z.object({
    patient: z.object({
      name: nameSchema,
      gender: z.enum(['Male', 'Female']),
      contactNo: z.string(),
      email: z.string().email(),
      address: z.string(),
      guardianInformation: guardianInformationSchema,
      attendentInformation: attendentInformationSchema,
    }),
  }),
});

export const PatientValidations = {
  createPatientValidationSchema,
};
