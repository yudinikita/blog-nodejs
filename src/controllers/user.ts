import { Request, Response } from 'express'
import UserService from '../service/user'
import { validationResult } from 'express-validator'
import { IUser, IUserToken } from '../models/User'

export const userRegister = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: 'Некорректные данные при регистрации'
      })
    }

    const newUser: IUser = await UserService.registration(req.body.login, req.body.password)

    const data: object = {
      login: newUser.login
    }

    return res.status(200).json({
      success: true,
      data
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    })
  }
}

export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: 'Неверный email или пароль, попробуйте еще раз'
      })
    }

    const user: IUserToken = await UserService.login(req.body.login, req.body.password)

    const data = {
      login: user.login,
      token: user.token
    }

    return res.status(200).json({
      success: true,
      data
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    })
  }
}
