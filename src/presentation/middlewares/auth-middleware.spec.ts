import { forbiden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middlewares'

describe('Auth Middleware',() => {
  test('Should return 403 if no x-access-token exist in headers',async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbiden(new AccessDeniedError()))
  })
})
