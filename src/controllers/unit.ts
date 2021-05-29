import { Request, Response, NextFunction } from 'express';
import UnitService from '../services/unit';


class UnitController {
  public getLogin = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/login', {
      title: 'Login',
    });
  };

  public getFindUnit = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect('/find_unit');
    }
    res.render('account/find_unit', {
      title: 'Unit Finder',
    });
  };

  public async getSearchUnit(req: Request, res: Response) {
      const resultFromModel = await UnitService.searchUnit(req.query.searchWord);
      const result = resultFromModel.map((unit) => {
          return {
            unitId: unit.unitId,
            unitName: unit.unitName,
          };
      })
      res.send(JSON.stringify(result));
  }
}

export default new UnitController();
