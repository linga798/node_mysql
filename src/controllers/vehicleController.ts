import { Request, Response, NextFunction, RequestHandler } from 'express';
import Vehicle from './../models/vehicleModel';

export const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
  const vehicles = await Vehicle.findAll();
  res.status(200).json({
    status: 'success',
    message: 'fetched vehicle list successfully.',
    data: {
      vehicles
    }
  });
};

export const createVehicle: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body });
    res.status(201).json({
      status: 'success',
      message: 'vehicle created successfully.',
      data: {
        vehicle
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const deleteVehicle: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicleToBeDeleted = await Vehicle.findByPk(id);
    await Vehicle.destroy({ where: { id } });
    res.status(200).json({
      status: 'success',
      message: 'vehicle deleted successfully.',
      data: {
        deletedVehicle: vehicleToBeDeleted
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const updateVehicle: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicleToBeUpdated = await Vehicle.findByPk(id);
    if (vehicleToBeUpdated) {
      await Vehicle.update({ isAvailable: true }, { where: { id } });
      res.status(200).json({
        status: 'success',
        message: 'vehicle updated successfully.',
        data: {
          vehicle: vehicleToBeUpdated
        }
      });
    } else {
      throw new Error('vehicle not found with given id.');
    }
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
