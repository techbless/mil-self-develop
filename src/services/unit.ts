import Unit from "../models/unit";
import { Op } from "sequelize";
import User from "../models/user";

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

  public async updateUnit(user: User, unitId: number) {
    return user.update({
      unitId,
    });
  }
}

export default new UnitService();
