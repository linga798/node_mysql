import { Request, Response, NextFunction, RequestHandler } from 'express';
import Vehicle from './../models/vehicleModel';
import { createVehicle, deleteVehicle, getAllVehicles, updateVehicle } from './vehicleController';

jest.mock('../models/userModel'); // Mocking the User model

describe('VehicleController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all vehicles successfully', async () => {
      const mockVehicleList = [
        { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      ];
      jest.spyOn(Vehicle, 'findAll').mockResolvedValue(mockVehicleList as any[]);

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getAllVehicles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'fetched vehicle list successfully.',
        data: {
          vehicles: mockVehicleList
        }
      });
    });
  });

  describe('createVehicle', () => {
    it('should create a vehicle record successfully', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(Vehicle, 'create').mockResolvedValue({ ...req.body });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await createVehicle(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'vehicle created successfully.',
        data: {
          vehicle: req.body
        }
      });
    });

    it('should throw error while create a vehicle record', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(Vehicle, 'create').mockRejectedValue({ message: 'message....' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await createVehicle(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'message....'
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle record successfully', async () => {
      const vehicle = { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 };
      const req = { params: { id: null } };
      jest.spyOn(Vehicle, 'destroy').mockResolvedValue(1);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await deleteVehicle(req as unknown as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'vehicle deleted successfully.',
        data: {
          deletedVehicle: null
        }
      });
    });

    it('should throw error while deleting a vehicle record', async () => {
      const req = { params: { id: null } };

      jest.spyOn(Vehicle, 'destroy').mockRejectedValue({ message: 'something went wrong' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await deleteVehicle(req as unknown as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'something went wrong'
      });
    });
  });

  describe('updateVehicle', () => {
    // it('should update a vehicle record successfully', async () => {
    //   const req = { params: { id: 1 } };

    //   jest.spyOn(Vehicle, 'update').mockResolvedValue([1]);

    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn()
    //   } as unknown as Response;
    //   const next = jest.fn();

    //   await updateVehicle(req as unknown as Request, res, next);

    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({
    //     status: 'success',
    //     message: 'vehicle updated successfully.',
    //     data: {
    //       vehicle: {
    //         createdAt: new Date('2024-01-17T05:55:28.000Z'),
    //         id: '1',
    //         image: 'activa_image.jpg',
    //         isAvailable: true,
    //         name: 'activa',
    //         number: '6hhe43',
    //         price: 2000,
    //         type: 'bike',
    //         updatedAt: new Date('2024-01-17T05:55:28.000Z')
    //       }
    //     }
    //   });
    // });

    describe('updateVehicle', () => {
      it('should update a vehicle record successfully', async () => {
        const updatedVehicleData = {
          id: '1',
          name: 'activa',
          number: '6hhe43',
          type: 'bike',
          image: 'activa_image.jpg',
          price: 2000,
          isAvailable: true,
          createdAt: new Date('2024-01-17T05:55:28.000Z'),
          updatedAt: new Date('2024-01-17T05:55:28.000Z')
        };

        const req = { params: { id: 1 }, body: updatedVehicleData };
        jest.spyOn(Vehicle, 'update').mockResolvedValue([1]);

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        } as unknown as Response;
        const next = jest.fn();

        await updateVehicle(req as unknown as Request, res, next);
        const expectedVehicle = {
          _changed: new Set(),
          _options: {
            _schema: null,
            _schemaDelimiter: '',
            attributes: ['id', 'name', 'number', 'type', 'price', 'isAvailable', 'image', 'createdAt', 'updatedAt'],
            isNewRecord: false,
            raw: true
          },
          _previousDataValues: {
            createdAt: new Date('2024-01-17T05:55:28.000Z'),
            id: '1',
            image: 'activa_image.jpg',
            isAvailable: true,
            name: 'activa',
            number: '6hhe43',
            price: 2000,
            type: 'bike',
            updatedAt: new Date('2024-01-17T05:55:28.000Z')
          },
          dataValues: {
            createdAt: new Date('2024-01-17T05:55:28.000Z'),
            id: '1',
            image: 'activa_image.jpg',
            isAvailable: true,
            name: 'activa',
            number: '6hhe43',
            price: 2000,
            type: 'bike',
            updatedAt: new Date('2024-01-17T05:55:28.000Z')
          },
          isNewRecord: false,
          uniqno: 1
        };

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          message: 'vehicle updated successfully.',
          data: {
            vehicle: expectedVehicle
          }
        });
      });
    });

    it('should throw error while updating a vehicle record', async () => {
      const req = { params: { id: null } };

      jest.spyOn(Vehicle, 'update').mockResolvedValue([1]);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await updateVehicle(req as unknown as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'vehicle not found with given id.'
      });
    });
  });
});
