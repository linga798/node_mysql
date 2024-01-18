import express from 'express';
import * as bookingController from './../controllers/bookingController';
import { isAccessible } from '../middlewares/routerProtector';
const router = express.Router();

//only admin can see all bookings
router.route('/').get((req, res, next) => isAccessible(req, res, next, ['admin']), bookingController.getAllBookings);

//admin or user role can book a vehicle
router.route('/').post((req, res, next) => isAccessible(req, res, next, ['admin', 'user']), bookingController.bookVehicle);

export default router;
