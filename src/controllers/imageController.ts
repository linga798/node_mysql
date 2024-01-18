import { Request, Response, NextFunction, RequestHandler } from 'express';
import Upload from '../models/imageModel';

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const image = await Upload.findByPk(id);
  if (image) {
    const imageData = image.data;
    res.set('Content-Type', 'image/jpeg');
    // const concatenatedImageData = Buffer.concat(imagesData);
    res.send(imageData);
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Image not found'
    });
  }
};

export const uploadImage: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    return res.status(400).json({
      status: 'error',
      message: 'No file uploaded.'
    });
  }
  const uploadedFiles = req.files as Express.Multer.File[];
  const images = await Promise.all(
    uploadedFiles.map(async (file) => {
      const image = await Upload.create({
        filename: file.originalname,
        data: file.buffer
      });
      return image;
    })
  );

  res.status(201).json({
    status: 'success',
    message: 'Image uploaded successfully.'
  });
};
