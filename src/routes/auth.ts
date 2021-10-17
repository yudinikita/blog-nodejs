import Router from 'express'
import { check } from 'express-validator'
import { userRegister, userLogin } from '../controllers/user'

const router = Router()

router
  .route('/login')
  .post(
    [
      check('login', 'Введите корректный логин').isLength({ min: 5, max: 42 }),
      check('password', 'Введите корректный пароль').exists()
    ], userLogin)

router
  .route('/register')
  .post(
    [
      check('login', 'Минимальная длина логина 5 символов').isLength({ min: 5, max: 42 }),
      check('password', 'Минимальная длина пароля 5 символов').isLength({ min: 5 })
    ], userRegister)

export default router
