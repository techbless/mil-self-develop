import Unit from '../models/unit';
import { Op } from 'sequelize';

class UnitService {
    public async searchUnit(searchWord: string) {
        return Unit.findAll({
            where:{
                unitName: {
                    [Op.like]: "%" + searchWord + "%"
                }
            }
        });
    }
}

export default new UnitService();