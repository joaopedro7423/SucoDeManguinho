import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { LoginControler } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const controller = new LoginControler(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
