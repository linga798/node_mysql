import { DataTypes, Model, Optional } from 'sequelize';
import User from './userModel';
import Vehicle from './vehicleModel';
import sequelize from '../db/config';

interface BookingAttributes {
  id: string;
  userId: string;
  vehicleId: string;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id'> {}

interface BookingInstance extends Model<BookingAttributes, BookingCreationAttributes>, BookingAttributes {
  createdAt?: Date;
}

const Booking = sequelize.define<BookingInstance>('Booking', {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  userId: {
    allowNull: false,
    type: DataTypes.UUID
  },
  vehicleId: {
    allowNull: false,
    type: DataTypes.UUID
  }
});

Booking.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId', targetKey: 'id', onDelete: 'CASCADE' });

Booking.beforeCreate<BookingInstance>(async (booking) => {
  const user = await User.findByPk(booking.userId);
  if (!user) {
    throw new Error('User not found');
  }
  const vehicle = await Vehicle.findByPk(booking.vehicleId);
  if (!vehicle || !vehicle.isAvailable) {
    throw new Error('Vehicle not found');
  }
});

Booking.afterCreate(async (booking, options) => {
  try {
    const vehicleId = booking.vehicleId;
    await Vehicle.update(
      {
        isAvailable: false
      },
      { where: { id: vehicleId } }
    );
  } catch (error) {}
});

Booking.sync()
  .then(() => {
    console.log('Table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing table:', error);
  });

export default Booking;
