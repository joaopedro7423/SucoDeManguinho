import { SignUpController } from './signup'
import {MissingParamError } from '../errors/missing-param-error'
import {InvalidParamError} from '../errors/invalid-param-error'
import {EmailValidator} from '../protocols/email-validator'

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator 
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator{
        isValid (email: string): boolean{
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    return{
        sut,
        emailValidatorStub
    }
}

describe('SingUp Controller', () => {
    //name test
    test('Should return 400 if no name is provided', () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
        
    })
    //email
    test('Should return 400 if no email is provided', () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
        
    })
    //password
    test('Should return 400 if no password is provided', () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
        
    })
     //password Confirmation
     test('Should return 400 if no passwordConfirmation is provided', () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
        
    })
    // email validation
    test('Should return 400 if an invalid email is provided', () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) //serve para mocar o validator se n da pau kkkkk porra manguinhu
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
        
    })
})