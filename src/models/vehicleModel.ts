import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';

interface VehicleAttributes {
  id: number;
  name: string;
  number: string;
  type: string;
  price: number;
  isAvailable: boolean;
  image: string;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

interface VehicleInstance extends Model<VehicleAttributes, VehicleCreationAttributes>, VehicleAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Vehicle = sequelize.define<VehicleInstance>('Vehicle', {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  number: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: {
      name: 'unique_number_constraint',
      msg: 'Number must be unique.' // Custom error message
    },
    validate: {
      isUnique: async function (value: string | null): Promise<void> {
        if (!value) {
          throw new Error('Number must be provided.');
        }

        const vehicle = await Vehicle.findOne({ where: { number: value } });

        if (vehicle && vehicle.id !== this.id) {
          throw new Error('Number must be unique.');
        }
      }
    }
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  price: {
    allowNull: false,
    type: DataTypes.FLOAT
  },
  isAvailable: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING
  }
});

// Synchronize the model with the database
Vehicle.sync()
  .then(() => {
    console.log('Table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing table:', error);
  });

export default Vehicle;
