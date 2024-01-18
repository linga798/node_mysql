import express, { Express, Request, Response, NextFunction } from 'express';
import vehicleRouter from './routes/vehicleRouter';
import authRouter from './routes/authRouter';
import bookingRouter from './routes/bookingRouter';
import imageRouter from './routes/imageRouter';
import multer from 'multer';

const app: Express = express();

app.use(express.json());

app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/users', authRouter);
app.use('/api/v1/bookings', bookingRouter);

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use('/api/v1/image', upload.array('data'), imageRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  res.status(404).json({ message: err.message });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('......................................');
  res.status(500).json({ message: err.message });
});

export default app;
