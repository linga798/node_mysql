import { Request, Response, NextFunction, RequestHandler } from 'express';
import Booking from './../models/bookingModel';
import Vehicle from '../models/vehicleModel';
import User from '../models/userModel';

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.findAll({ include: [Vehicle, User.scope('excludeSensitiveAttributes')] });
    res.status(200).json({
      status: 'success',
      message: 'fetched bookings list successfully.',
      data: {
        bookings
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const bookVehicle: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Booking.create({ ...req.body });
    res.status(201).json({
      status: 'success',
      message: 'Vehicle booked successfully.',
      data: {
        order
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
