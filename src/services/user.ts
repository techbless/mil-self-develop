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

  public async updatePassword(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    await user!.update(
      {
        password,
      }
    )
  }
}

export default new UserService();