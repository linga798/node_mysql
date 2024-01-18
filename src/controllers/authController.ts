import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from './../models/userModel';
import * as jwt from 'jsonwebtoken';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: 'success',
      message: 'fetched User list successfully.',
      data: {
        users
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

const signToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.SECRET_STR ?? '', { expiresIn: process.env.LOGIN_EXPIRES });
};

export const signup: RequestHandler = async (req: Request, res: Response, next) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(201).json({
      status: 'success',
      message: 'User created successfully.',
      data: {
        user
      }
    });
  } catch (err: any) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      throw new Error('Please provide username and password for login.');
    }

    //check if user exist in DB
    const user = await User.findOne({ where: { username } });
    //if user exist and password matches
    if (!user || !(password === user?.password)) {
      throw new Error('Incorrect username or password.');
    }

    const token = signToken(user.id, user.role ?? '');

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err: any) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
