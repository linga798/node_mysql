import dotenv from 'dotenv';
import app from './app';
import mysql, { Pool } from 'mysql2/promise';
import connection from './db/config';

dotenv.config({ path: './config.env' });

const PORT: number = Number(process.env.PORT) ?? 3000;

// const mysqlPool: Pool = mysql.createPool({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABSE
// });

// mysqlPool
//   .query('SELECT 1')
//   .then((data) => {
//     console.log('successfully connected to DB....');
//     app.listen(PORT, () => {
//       console.log(`Server is running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log('something went wrong....', err);
//   });

connection
  .sync()
  .then(() => {
    console.log('successfully connected to database.....');
  })
  .catch((err: Error) => {
    console.log('something went wrong.....', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
