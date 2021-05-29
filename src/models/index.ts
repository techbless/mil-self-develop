import User, { associate as associateUser } from './user';
import Unit, { associate as associateUnit } from './unit';

export * from './sequelize';

const db = {
  User,
  Unit,
};

export type dbType = typeof db;

associateUser(db);
associateUnit(db);