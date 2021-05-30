import Unit from '../models/unit';
import User from '../models/user';

import { Op, fn, col } from 'sequelize';
import { sequelize } from '../models';

class RankService {

    public async getPersonalRank() {
        const rawResult = await User.findAll({
            raw: true,
            order: [
                ['score', 'DESC'],
            ]
        });

        const result = rawResult.map((row) => {
            return row;
        })

        return result;
    }
}

export default new RankService();