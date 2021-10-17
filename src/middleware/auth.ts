import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token: string = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Ошибка авторизации'
      })
    }

    // @ts-ignore
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    res.status(401).json({
      success: false,
      message: 'Ошибка авторизации'
    })
  }
}
