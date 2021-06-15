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


  public async verifyToken(email: string, token: string, purpose: Purpose) {
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
  
      await tokens[0].destroy();
      return true;
  }

  //public async verifyToken(email: string, tokenFromLink: string, purpose: Purpose): Promise<boolean> {
    /*const subscriber = await SubscriptionService.findSubscriberByEmail(email);

    if (!subscriber) {
      return false;
    }

    const token = await subscriber.getTokens({
      where: {
        token: tokenFromLink,
        purpose,
      },
    });

    // if the token exists here, the verification is valid.
    if (token.length <= 0) {
      return false;
    }

    token[0].destroy();
    return true;*/
  //}
}

export default new TokenService();