import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginControler } from '../../../../presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginControler(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}