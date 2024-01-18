import { Request, Response, NextFunction, RequestHandler } from 'express';
import User from './../models/userModel';
import * as jwt from 'jsonwebtoken';

// export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     //1.read the token and check if exist
//     const testToken = req.headers.authorization;
//     let token;
//     if (testToken && testToken.startsWith('Bearer')) {
//       token = testToken.split(' ')[1];
//     }

//     if (!token) {
//       throw new Error('You are not logged in.');
//     }
//     //2.validate the token
//     const decodedToken = jwt.verify(token, process.env.SECRET_STR ?? '') as { id: string; role: string };

//     //3.if the user exist
//     const user = await User.findOne({ where: { id: decodedToken.id } });
//     if (!user) {
//       throw new Error('The user with given token does not exist.');
//     }

//     //5.allow user to access route
//     next();
//   } catch (err: any) {
//     res.status(401).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

export const isAccessible = async (req: Request, res: Response, next: NextFunction, roles: string[]): Promise<void> => {
  try {
    //1.read the token and check if exist
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer')) {
      token = testToken.split(' ')[1];
    }

    if (!token) {
      throw new Error('You are not logged in.');
    }
    //2.validate the token
    const decodedToken = jwt.verify(token, process.env.SECRET_STR ?? '') as { id: string; role: string };

    //3.if the user exist
    const user = await User.findOne({ where: { id: decodedToken.id } });
    if (!user) {
      throw new Error('The user with given token does not exist.');
    }

    if (user && !roles.includes(user.role)) {
      throw new Error('The user is not authorized to access the resource.');
    }

    //5.allow user to access route
    next();
  } catch (err: any) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
