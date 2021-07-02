import { Request, Response } from "express";
import RankService from "../services/rank";

class RankController {
  public async getRank(req: Request, res: Response) {
    if (!req.user) {
      return res.redirect("/login");
    }

    const rankInList = await RankService.getPersonalRank();

    let myRank = -1;
    let i = 0;
    for (const u of rankInList) {
      if (u.userId == req.user.userId) {
        myRank = i + 1;
        break;
      }
      i++;
    }
    console.log(myRank);
    res.render("rank", {
      myRank,
      user: req.user,
      title: "Ranking",
      rankInList: rankInList,
    });
  }

  public async getUnitRank(req: Request, res: Response) {
    if (!req.user) {
      return res.redirect("/login");
    }

    const rankInList = await RankService.getUnitRank();

    res.render("unit_rank", {
      title: "Ranking",
      rankInList: rankInList,
    });
  }
}

export default new RankController();
