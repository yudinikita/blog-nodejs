import UserModel, { IUser, IUserToken } from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserService {
  async registration (login: string, password: string): Promise<IUser> {
    const candidate: IUser = await UserModel.findOne({ login })

    if (candidate) {
      throw new Error(`Пользователь с таким логином ${login} уже существует`)
    }

    const hashedPassword: string = await bcrypt.hash(password, await bcrypt.genSalt(10))

    return await UserModel.create({
      login,
      password: hashedPassword
    })
  }

  async login (login: string, password: string): Promise<IUserToken> {
    const user: IUser = await UserModel.findOne({ login })

    if (!user) {
      throw new Error('Неверный email или пароль, попробуйте еще раз')
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error('Неверный email или пароль, попробуйте еще раз')
    }

    const token: string = await jwt.sign(
      { login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    return {
      login: user.login,
      password: user.password,
      token: token
    }
  }
}

export default new UserService()
