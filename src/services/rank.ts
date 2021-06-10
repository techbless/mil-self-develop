import Unit from '../models/unit';
import User from '../models/user';

import { fn, col, ProjectionAlias } from 'sequelize';

class RankService {

    public async getPersonalRank() {
        return User.findAll({
            raw: true,
            order: [
                ['score', 'DESC'],
            ]
        });
    }

    
    public async getUnitRank() {
        return User.findAll({
            raw: true,
            attributes: [fn('sum', col('score')) as unknown as ProjectionAlias],
            include: [
                {
                    model: Unit,
                    required: true,
                    attributes: ['unitName'],
                }
            ],
            order: [
                [fn('sum', col('score')), 'desc']
            ],
            group: ['User.unitId']
        });
    }
}

export default new RankService();