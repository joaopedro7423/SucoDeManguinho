import { SignUpController } from './signup'
import {EmailValidator, AccountModel,AddAccount,AddAccountModel } from './signup-protocols'
import { MissingParamError,InvalidParamError, ServerError } from '../../errors'

    //cria uma variavel  recebe nenhum parametro : retorna o azul ae kkkk
const makeEmailValidator = (): EmailValidator =>{
    class EmailValidatorStub implements EmailValidator{
        isValid (email: string): boolean{
            return true
        }  
     }
       return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount =>{
    class AddAccountStub implements EmailValidator{
        add (account: AddAccountModel): AccountModel{
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }
            return fakeAccount
        }  
     }
       return new AddAccountStub()
}

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator 
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, addAccountStub)

    return{
        sut,
        emailValidatorStub,
        addAccountStub
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
     test('Should return 400 if no password Confirmation is provided', () => {
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
    //verificação se a confirmação do password é igual ao password
    test('Should return 400 if  password Confirmation fails', () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
        
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
      // email validation shold call verifica se o email é o correto
      test('Should call EmailValidator with correct email', () => {
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenLastCalledWith('any_email@mail.com')
    })

       //erro de servidor com email
       test('Should return 500 if EmailValidator throws', () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
         const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
        
    })

    test('Should return 500 if AddAccount throws', () => {
        const {sut, addAccountStub} = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(()=>{
            throw new Error()
        })
         const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse =  sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
        
    })

    test('Should call AddAccount with correct values', () => {
        const {sut, addAccountStub} = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(addSpy).toHaveBeenLastCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    })
})