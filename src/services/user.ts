import User from '../models/user';

class UserService {
  public async getUserByEmail(email: string) {
    return User.findOne({
      where: {
        email: email,
      }
    })
  }

  public verifyUser(email: string) {
    User.update(
      {
        isVerified: true,
      },
      {
        where: {
          email,
        }
      }
    );
  }
}

export default new UserService();