import { Router } from 'express';
import { UserControllers } from './user.controller';
import { PatientValidations } from '../patient/patient.validation';
import validateRequest from '../../middleware/validateRequests';

const router = Router();

router.post(
  '/create-patient',
  validateRequest(PatientValidations.createPatientValidationSchema),
  UserControllers.createPatient,
);

export const UserRoute = router;
