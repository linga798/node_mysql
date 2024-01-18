import { Request, Response, NextFunction, RequestHandler } from 'express';
import Booking from './../models/bookingModel';
import Vehicle from '../models/vehicleModel';
import User from '../models/userModel';
import { bookVehicle, getAllBookings } from './bookingController';

describe('BookingController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllBookings', () => {
    it('should get all bookings successfully', async () => {
      const mockBookingList = [
        { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      ];
      jest.spyOn(Booking, 'findAll').mockResolvedValue(mockBookingList as any[]);

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getAllBookings(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'fetched bookings list successfully.',
        data: {
          bookings: mockBookingList
        }
      });
    });

    it('should throw error while fetching bookings lsit.', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(Booking, 'findAll').mockRejectedValue({ message: 'something went wrong' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getAllBookings(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'something went wrong'
      });
    });
  });

  describe('createBooking', () => {
    it('should create a Booking record successfully', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(Booking, 'create').mockResolvedValue({ ...req.body });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await bookVehicle(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Vehicle booked successfully.',
        data: {
          order: req.body
        }
      });
    });

    it('should throw error while booking a vehicle', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(Vehicle, 'create').mockRejectedValue({ message: '' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await bookVehicle(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'notNull Violation: Booking.userId cannot be null,\nnotNull Violation: Booking.vehicleId cannot be null'
      });
    });
  });
});
