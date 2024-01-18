import { Request, Response } from 'express';
import { getAllUsers, signup, login } from './authController';
import User from '../models/userModel';

jest.mock('../models/userModel'); // Mocking the User model

describe('UserController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockUserList = [{ id: 1, username: 'user1', password: 'password1' }];
      jest.spyOn(User, 'findAll').mockResolvedValue(mockUserList as any[]);

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'fetched User list successfully.',
        data: {
          users: mockUserList
        }
      });
    });

    it('should throw error while fetching users', async () => {
      const req = {
        body: { id: 1, name: 'activa', number: '6hhe43', type: 'bike', image: 'activa_image.jpg', price: 2000 }
      };

      jest.spyOn(User, 'findAll').mockRejectedValue({ message: 'unable fetch users list.' });

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await getAllUsers(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'unable fetch users list.'
      });
    });
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const mockUser = { id: 1, username: 'newUser', password: 'newPassword' };
      jest.spyOn(User, 'create').mockResolvedValue(mockUser);

      const req = { body: mockUser } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User created successfully.',
        data: {
          user: mockUser
        }
      });
    });

    it('should handle signup failure and return a 400 status', async () => {
      const errorMessage = 'Error creating user';
      jest.spyOn(User, 'create').mockRejectedValue(new Error(errorMessage));

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const next = jest.fn();

      await signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: errorMessage
      });
    });
  });

  describe('login', () => {
    it('should log in successfully and return a token', async () => {
      const mockUser = { id: 1, username: 'existingUser', password: 'existingPassword', role: 'user' };
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as any);

      const req = { body: { username: 'existingUser', password: 'existingPassword' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        token: expect.any(String)
      });
    });

    it('should handle login failure due to incorrect username or password and return a 401 status', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const req = { body: { username: 'nonexistentUser', password: 'incorrectPassword' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Incorrect username or password.'
      });
    });

    it('should handle login failure due to missing username or password and return a 401 status', async () => {
      const req = { body: {} } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Please provide username and password for login.'
      });
    });
  });
});
