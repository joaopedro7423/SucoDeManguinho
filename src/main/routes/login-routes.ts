import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/Login/signup/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/Login/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup',adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
