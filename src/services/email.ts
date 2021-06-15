import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';

import { Purpose } from '../models/token';
import User from '../models/user';

import TokenService from './token';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
        service: 'gmail',
        // host를 gmail로 설정
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });
  }

  private async sendEmail(email: string, subject: string, content: string) {
    this.transporter.sendMail({
      from: `"보내는 사람 이름" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: subject,
      text: content,
      html: `<b>${content}</b>`,
    });
  }


  public async sendVerficationEmail(user: User, purpose: Purpose) {
    const token: string = await TokenService.issueToken(user.userId, purpose);

    let url;
    switch(purpose) {
      case 'register':
        url = `localhost:3000/verify?email=${user.email}&token=${token}&purpose=register`;
        this.sendEmail(user.email, '회원가입 인증', url);
        break;
      case 'reset':
        url = `localhost:3000/reset_password?email=${user.email}&token=${token}`
        this.sendEmail(user.email, '비밀번호 재설정', url);
        break;
      default:
        break;
    }
  }
}

export default new EmailService();