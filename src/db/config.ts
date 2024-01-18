import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const sequelize = new Sequelize(
  process.env.DATABASE ?? 'practice',
  process.env.USER ?? 'root',
  process.env.PASSWORD ?? 'root',
  {
    dialect: 'mysql'
  }
);

export default sequelize;
