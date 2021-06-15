import { Model, DataTypes, Association, BelongsToGetAssociationMixin } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';
import User from './user';

class Article extends Model {
    public readonly articleId!: number;

    public readonly subject!: string;

    public readonly markdown!: string;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;

    public getUser!: BelongsToGetAssociationMixin<User>;

    public static associations: {
      articles: Association<Article, User>;
    };

}

Article.init({
  articleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subject: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  markdown: {
    type: DataTypes.STRING(15000),
    allowNull: true,
    unique: false,
  },
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'articles',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Article.belongsTo(db.User, { foreignKey: 'userId' });
};

export default Article;
