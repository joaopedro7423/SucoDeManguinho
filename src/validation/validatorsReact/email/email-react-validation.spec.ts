import { InvalidFieldError } from '@/validation/errors'
import { EmailValidationR } from './email-react-validation'
import faker from 'faker'

describe('EmailValidation', () => {
    test('Should return error if email is valid ', () => {
        const sut = new EmailValidationR(faker.random.word())
        const error = sut.validate(faker.random.word())
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Should return false if email is valid ', () => {
        const sut = new EmailValidationR(faker.random.word())
        const error = sut.validate(faker.internet.email())
        expect(error).toBeFalsy()
    })
})
