import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isAccessible } from './routerProtector';
import User from './../models/userModel';

jest.mock('jsonwebtoken');

describe('isAccessible Middleware', () => {
  let req: Request;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer yourTokenHere' } } as Request;
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should allow access for an authorized user with the correct role', async () => {
    const userMock = {
      id: '1',
      role: 'admin'
    };

    const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(userMock as any);
    (jwt.verify as jest.Mock).mockReturnValueOnce({ id: userMock.id, role: userMock.role });

    await isAccessible(req as Request, res as Response, next, ['admin']);

    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: userMock.id } });
    expect(next).toHaveBeenCalled();
  });

  it('should deny access for an unauthorized user with the incorrect role', async () => {
    const userMock = {
      id: '2',
      role: 'user'
    };

    const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(userMock as any);
    (jwt.verify as jest.Mock).mockReturnValueOnce({ id: userMock.id, role: userMock.role });

    await isAccessible(req as Request, res as Response, next, ['admin']);

    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: userMock.id } });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'The user is not authorized to access the resource.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access for a user without a valid token', async () => {
    req.headers.authorization = undefined;

    await isAccessible(req as Request, res as Response, next, ['admin']);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'You are not logged in.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access for a user with a token for a nonexistent user', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ id: 'nonexistentId', role: 'admin' });
    const findOneSpy = jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await isAccessible(req as Request, res as Response, next, ['admin']);

    expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 'nonexistentId' } });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'The user with given token does not exist.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should deny access for a user with an invalid token', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await isAccessible(req as Request, res as Response, next, ['admin']);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
