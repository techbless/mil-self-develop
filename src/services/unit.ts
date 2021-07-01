import Unit from "../models/unit";
import { Op } from "sequelize";

class UnitService {
  public async searchUnit(searchWord: string) {
    return Unit.findAll({
      where: {
        unitName: {
          [Op.like]: "%" + searchWord + "%",
        },
      },
    });
  }

  public async createUnit(unitName: string) {
    return Unit.create({
      unitName: unitName,
    });
  }
}

export default new UnitService();
