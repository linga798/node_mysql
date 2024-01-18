import { Request, Response, NextFunction, RequestHandler } from 'express';
import Upload from '../models/imageModel';
import { getImage } from './imageController';

describe('ImageController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getImage', () => {
    it('should get image by id', async () => {
      const req = {
        params: { id: 1 }
      };
      const mockBookingList = [
        { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      ];
      jest.spyOn(Upload, 'findByPk').mockResolvedValue({ data: 'data' } as any);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn(),
        send: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getImage(req as unknown as Request, res, next);

      expect(res.send).toHaveBeenCalledWith('data');
    });

    it('should throw error while fetching image.', async () => {
      const req = {
        params: { id: 1 }
      };

      jest.spyOn(Upload, 'findByPk').mockRejectedValue({ message: 'something went wrong' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getImage(req as unknown as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'something went wrong'
      });
    });
  });
});
