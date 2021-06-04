import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class User extends Model {
    public readonly userId!: number;

    public userName!: string;

    public email!: string;
    
    public rank!: string;
    
    public score!: number;
    
    public password!: string;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}

User.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  rank: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: false,
  },
  score: {
    type: DataTypes.INTEGER,
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  User.belongsTo(db.Unit, {foreignKey: 'unitId'});
  User.hasMany(db.Article, { foreignKey: 'userId' });
};

export default User;
