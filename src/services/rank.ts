import Unit from '../models/unit';
import User from '../models/user';

import { Op, fn, col, ProjectionAlias } from 'sequelize';
import { sequelize } from '../models';
import { Fn } from 'sequelize/types/lib/utils';

class RankService {

    public async getPersonalRank() {
        const result = await User.findAll({
            raw: true,
            order: [
                ['score', 'DESC'],
            ]
        });

        return result;
    }

    public async getUnitRank() {
        const result = await User.findAll({
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

        return result;
    }

}

export default new RankService();