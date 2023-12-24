import express from 'express';
import { PatientController } from './patient.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth(USER_ROLE.patient), PatientController.getAllPatient);
router.get('/:id', PatientController.getSinglePatient);
router.delete('/:id', PatientController.deletePatient);
router.patch('/:id', PatientController.updatePatient);

export const PatientRoute = router;
