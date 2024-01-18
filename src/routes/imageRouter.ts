import express from 'express';
import * as uploadController from '../controllers/imageController';
import { isAccessible } from '../middlewares/routerProtector';

const router = express.Router();

router
  .route('/')
  .post((req, res, next) => isAccessible(req, res, next, ['admin', 'fileHandler']), uploadController.uploadImage);
router
  .route('/:id')
  .get((req, res, next) => isAccessible(req, res, next, ['admin', 'fileHandler']), uploadController.getImage);

export default router;
