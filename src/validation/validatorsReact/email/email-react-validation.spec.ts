import { InvalidFieldError } from '@/validation/errors'
import { EmailValidationR } from './email-react-validation'
import faker from 'faker'

const makeSut = (): EmailValidationR => new EmailValidationR(faker.random.word())

describe('EmailValidation', () => {
    test('Should return error if email is valid ', () => {
        const sut = makeSut()
        const error = sut.validate(faker.random.word())
        expect(error).toEqual(new InvalidFieldError())
    })

    test('Should return false if email is valid ', () => {
        const sut = makeSut()
        const error = sut.validate(faker.internet.email())
        expect(error).toBeFalsy()
    })

    test('Should return false if email is empty ', () => {
        const sut = makeSut()
        const error = sut.validate('')
        expect(error).toBeFalsy()
    })
})
