import { Request, Response } from "express";
import UnitService from "../services/unit";

class UnitController {
  public getFindUnit = (req: Request, res: Response) => {
    res.render("account/find_unit", {
      title: "Unit Finder",
    });
  };

  public async getSearchUnit(req: Request, res: Response) {
    const resultFromModel = await UnitService.searchUnit(
      req.query.searchWord as string
    );
    const result = resultFromModel.map((unit) => {
      return {
        unitId: unit.unitId,
        unitName: unit.unitName,
      };
    });
    res.send(JSON.stringify(result));
  }

  public getCreateUnit(req: Request, res: Response) {
    res.render("account/new_unit");
  }

  public async postCreateUnit(req: Request, res: Response) {
    const unitName = req.body.unitName as string;
    await UnitService.createUnit(unitName);
    res.redirect("/");
  }
}

export default new UnitController();
