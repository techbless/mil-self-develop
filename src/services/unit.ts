import Unit from '../models/unit';
import { Op } from 'sequelize';

class UnitService {
    public async searchUnit(searchWord: string) {
        const result = await Unit.findAll({
            where:{
                unitName: {
                    [Op.like]: "%" + searchWord + "%"
                }
            }
        });

        return result;
    }
}

export default new UnitService();