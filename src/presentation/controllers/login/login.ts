import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginControler implements Controller {
  private readonly emailvalidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailvalidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      if (!email) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValid = this.emailvalidator.isValid(email)
      if (!isValid) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }
      return ok(isValid)
    } catch (error) {
      // outra forma de mostrar um erro sem usar o npm test, mais aconselhavel utilizar nos debug:
      // console.error(error)

      return serverError(error)
    }
  }
}
