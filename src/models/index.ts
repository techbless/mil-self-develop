import User, { associate as associateUser } from './user';
import Unit, { associate as associateUnit } from './unit';
import Article, { associate as associateArticle } from './article';

export * from './sequelize';

const db = {
  User,
  Unit,
  Article,
};

export type dbType = typeof db;

associateUser(db);
associateUnit(db);
associateArticle(db);