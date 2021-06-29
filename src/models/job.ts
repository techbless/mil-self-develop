import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Job extends Model {
  public readonly tokenId!: number;

  public jobId!: number;

  public userId!: number;

  public category!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Job.init(
  {
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize,
    modelName: "Job",
    tableName: "jobs",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

export const associate = (db: dbType) => {
  Job.belongsTo(db.User, { foreignKey: "userId" });
};

export default Job;
