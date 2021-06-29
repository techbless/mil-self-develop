import * as crypto from 'crypto';
import Token, { Purpose } from '../models/token';

import UserService from '../services/user';

class TokenService {
  public async issueToken(userId: number, purposeOrNull: Purpose) {
    const token = crypto.randomBytes(64).toString('hex');

    const issuedToken = await Token.create({
      token,
      userId,
      purpose: purposeOrNull,
    });

    return issuedToken.token;
  }


 public async verifyToken(email: string, token: string, purpose: Purpose, remove: boolean) {
      const user = await UserService.getUserByEmail(email);

      if(!user) {
          return false;
      }

      const tokens = await user.getTokens({
        where: {
            token: token,
            purpose,
          }, 
      });
      
      if (tokens.length <= 0) {
        return false;
      }
  
      if(remove) {
          await tokens[0].destroy();
      }
      return true;
  }
}

export default new TokenService();