import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Unit extends Model {
    public readonly unitId!: number;

    public unitName!: string;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}

Unit.init({
  unitId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  unitName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Unit',
  tableName: 'units',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Unit.hasMany(db.User, { foreignKey: 'unitId' });
};

export default Unit;
