import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
interface UserAttributes {
  id: string;
  username: string;
  password: string;
  role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>('User', {
  id: {
    allowNull: false,
    autoIncrement: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: {
      name: 'username_constraint',
      msg: 'User already exist with this username.'
    },
    validate: {
      isUnique: async function (value: string | null): Promise<void> {
        if (!value) {
          throw new Error('Username must be provided.');
        }

        const user = await User.findOne({ where: { username: value } });

        if (user && user?.username !== this.username) {
          throw new Error('User already exist with this username.');
        }
      }
    }
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
});

User.addScope('excludeSensitiveAttributes', {
  attributes: { exclude: ['password', 'role'] }
});

// Synchronize the model with the database
User.sync()
  .then(() => {
    console.log('Table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing table:', error);
  });

export default User;
