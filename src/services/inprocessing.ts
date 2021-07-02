import Book from "../models/book";
import Job from "../models/job";
import User from "../models/user";

import fetch from "node-fetch";

type jobType = {
  [index: string]: string[];
  j1: string[];
  j2: string[];
  j3: string[];
  j4: string[];
  j5: string[];
  j6: string[];
  j7: string[];
  j8: string[];
  j9: string[];
  j10: string[];
  j11: string[];
  j12: string[];
  j13: string[];
  j14: string[];
  j15: string[];
  j16: string[];
  j17: string[];
  j18: string[];
  j19: string[];
};

class InprocessingService {
  public async setJobCategory(userId: number, categories: string[]) {
    for (const category of categories) {
      await Job.create({
        userId,
        category,
      });
    }
  }

  public async getJobCategories(user: User) {
    return user.getJobs();
  }

  public async recommendCertificates(user: User) {
    const jobs = await this.getJobCategories(user);

    const chooseRandom = (arr: string[], num = 1) => {
      const res = [];
      if (arr.length <= num) {
        return arr;
      }
      for (let i = 0; i < num; ) {
        const random = Math.floor(Math.random() * arr.length);
        if (res.indexOf(arr[random]) !== -1) {
          continue;
        }
        res.push(arr[random]);
        i++;
      }
      return res;
    };

    const certificates: jobType = {
      j1: ["직업상담사", "사회복지사"],
      j2: ["공인중개사"],
      j3: ["유기농업기사", "유기농업산업기사"],
      j4: ["실내건축기사"],
      j5: ["승강기기사", "승강기기능사"],
      j6: ["자동차정비기사", "자동차정비기능사"],
      j7: ["용접기사"],
      j8: ["초음파비파괴검사기사", "초음파비파괴검사기능사"],
      j9: ["전기공사기사", "전기기사", "전기산업기사", "전기기능사"],
      j10: ["정보통신기사", "무선설비기사"],
      j11: ["토목산업기사", "실내건축기능사", "배관기능사", "배관기능장"],
      j12: ["가스기능사"],
      j13: ["무선설비기능사", "정보처리기능사"],
      j14: ["굴삭기운전기능사", "로더운전기능사", "롤러운전기능사"],
      j15: ["기중기운전기능사", "지게차운전기능사"],
      j16: ["유통관리사"],
      j17: ["한식조리기능사", "양식조리기능사"],
      j18: ["컴퓨터활용능력1급", "컴퓨터활용능력2급"],
      j19: ["공인노무사", "감정평가사"],
    };

    let temp = [];
    for (const job of jobs) {
      const jobIdx = job.category;
      const certs = certificates[jobIdx];
      for (const cert of certs) {
        temp.push(cert);
      }
    }

    const result = chooseRandom(temp, 5);
    return result;
  }

  public async recommendBook(user: User) {
    const books = await user.getBooks();
    const book = books[0];
    console.log("-----", book.name, book.author);
    return fetch(
      `http://${process.env.BOOK_API_URL}/recommend?orgTitle=${encodeURI(
        book.name
      )}&orgAuthor=${encodeURI(book.author)}`
    );
  }

  public async addBook(userId: number, name: string, author: string) {
    const escapedName = name.replace(/<[^>]*>?/gm, "");
    const escapedAuthor = author.replace(/<[^>]*>?/gm, "");
    console.log(name, escapedName);
    Book.create({
      userId,
      name: escapedName,
      author: escapedAuthor,
    });
  }
}

export default new InprocessingService();
