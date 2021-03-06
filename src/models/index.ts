import User, { associate as associateUser } from "./user";
import Unit, { associate as associateUnit } from "./unit";
import Article, { associate as associateArticle } from "./article";
import Token, { associate as associateToken } from "./token";
import Job, { associate as associateJob } from "./job";
import Book, { associate as associateBook } from "./book";

export * from "./sequelize";

const db = {
  User,
  Unit,
  Article,
  Token,
  Job,
  Book,
};

export type dbType = typeof db;

associateUser(db);
associateUnit(db);
associateArticle(db);
associateToken(db);
associateJob(db);
associateBook(db);
