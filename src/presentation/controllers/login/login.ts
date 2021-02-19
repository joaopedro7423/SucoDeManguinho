import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'

export class LoginControler implements Controller {
  private readonly emailvalidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailvalidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const isValid = this.emailvalidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      // error 401 (nao sabe o usuario)
      // error 403 (o usuario n tem permição)

      const accessToken = await this.authentication.auth(email,password)

      if (!accessToken) {
        return unauthorized()
      }

      // return unauthorized()
      return ok('401')
    } catch (error) {
      return serverError(error)
    }
  }
}
