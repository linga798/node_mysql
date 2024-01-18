import express from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { isAccessible } from '../middlewares/routerProtector';
const router = express.Router();

//admin or user can access vehicles list
router.route('/').get((req, res, next) => isAccessible(req, res, next, ['admin', 'user']), vehicleController.getAllVehicles);

//admin only can create vehicle details
router.route('/').post((req, res, next) => isAccessible(req, res, next, ['admin']), vehicleController.createVehicle);

//admin only can update vehicle details(availability)
router.route('/:id').patch((req, res, next) => isAccessible(req, res, next, ['admin']), vehicleController.updateVehicle);

router.route('/:id').delete((req, res, next) => isAccessible(req, res, next, ['admin']), vehicleController.deleteVehicle);

export default router;
