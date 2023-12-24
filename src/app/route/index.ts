import { Router } from 'express';
import { PatientRoute } from '../modules/patient/patient.route';
import { UserRoute } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.router';

const router = Router();

const moduleRoutes = [
  {
    path: '/patients',
    route: PatientRoute,
  },
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
