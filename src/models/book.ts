import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Book extends Model {
  public readonly bookId!: number;

  public userId!: number;

  public name!: string;

  public author!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Book.init(
  {
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: false,
    },
    author: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

export const associate = (db: dbType) => {
  Book.belongsTo(db.User, { foreignKey: "userId" });
};

export default Book;
