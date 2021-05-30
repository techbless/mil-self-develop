import { Request, Response, NextFunction } from 'express';
import RankService from '../services/rank';


class RankController {
  public async getRank(req: Request, res: Response) {
    if (!req.user) {
      return res.redirect('/login');
    }

    const rankInList = await RankService.getPersonalRank();

    res.render('rank', {
      title: 'Ranking',
      rankInList: rankInList,
    });
  };
}

export default new RankController();
