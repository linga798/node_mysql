import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';

interface ImageAttributes {
  id: string;
  filename: string;
  data: Buffer;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

interface ImageInstance extends Model<ImageAttributes, ImageCreationAttributes>, ImageAttributes {}

const Image = sequelize.define<ImageInstance>('Image', {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
});

// Synchronize the model with the database
Image.sync()
  .then(() => {
    console.log('Table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing table:', error);
  });

export default Image;
