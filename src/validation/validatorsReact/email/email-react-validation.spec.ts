import { InvalidFieldError } from '@/validation/errors'
import { EmailValidationR } from './email-react-validation'

describe('EmailValidation', () => {
    test('Should return error if email is valid ', () => {
        const sut = new EmailValidationR('email')
        const error = sut.validate('')
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Should return error if email is valid ', () => {
        const sut = new EmailValidationR('email')
        const error = sut.validate('')
        expect(error).toEqual(new InvalidFieldError())
    })
})
