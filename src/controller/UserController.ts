import { Request, Response } from 'express';
import { myDataBase } from '../../db';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateRefreshToken, generateAccessToken, generatePassword, registerToken } from '../utils/Auth';



dotenv.config();


export class UserController {
  static userRepo;
  static initialize() {
    this.userRepo = myDataBase.getRepository(User);
  }
  static register = async (req: Request, res: Response) => {
    console.log(req.body)
    const { id, userId, password, userName, phoneNumber, userEmail } = req.body;
   console.log(password)
    const userIdRegx = /^[a-zA-Z0-9]{4,16}$/.test(userId);
    if (!userIdRegx) {
      return res.status(400).json({
        message: 'ID는 숫자와 영문 대소문자 4~16자까지만 가능합니다.',
      });
    }
    const userNameRegex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣._-]{1,20}$/;
    if (!userNameRegex.test(userName)) {
      return res.status(400).json({ message: '유효한 닉네임이 아닙니다.' });
    }
    const existUser = await this.userRepo.findOne({
      where: { userId: userId },
    });
    if (existUser) {
      return res.status(400).json({ message: '중복된 아이디 입니다.' });
    }

    const user = this.userRepo.create({
      userId,
      password: await generatePassword(password),
      userName,
      phoneNumber,
      userEmail
    });
    const newUser =await this.userRepo.save(user);
    const accessToken = generateAccessToken(newUser.id, newUser.userId, newUser.userName);
    const refreshToken = generateRefreshToken(newUser.id, newUser.userId, newUser.userName);
    
    registerToken(refreshToken, accessToken);
    
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    
    try {
      res.cookie('refreshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
      res.status(201).send({ content: decoded, accessToken });
    } catch (err) {
      res.status(500).json({ message: '회원 가입 중 오류가 발생하였습니다. ' });
    }
  };
  static login = async (req: Request, res: Response) => {
    const { userId, password } = req.body;
    const user = await this.userRepo.findOne({
      where: { userId },
      select: {
        id: true,
        userId: true,
        password: true
      }
    });
    if (!user) {
      return res.status(400).json({ message: '회원가입이 되어있지 않습니다.' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: '아이디 혹은 비밀번호가 일치하지 않습니다.' });
    }
    const accessToken = generateAccessToken(user.id, user.userId, user.userName);
    const refreshToken = generateRefreshToken(user.id, user.userId, user.userName);
    const decoded = verify(accessToken, process.env.SECRET_ATOKEN);
    try {
      res.cookie('refreshToken', refreshToken, { path: '/', httpOnly: true, maxAge: 3600 * 24 * 30 * 1000 });
      res.status(201).send({ content: decoded, accessToken });
    } catch (err) {
      res.status(500).json({ message: '로그인 실패하였습니다.' });
    }
  };
  static logout = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', { path: '/' });
    try {
      res.status(204).json({ message: '로그 아웃되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: '로그 아웃을 실패하였습니다.' });
    }
  };
}
