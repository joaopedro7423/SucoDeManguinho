import { SignUpController } from './signup'
import {EmailValidator, AccountModel,AddAccount,AddAccountModel, Validation } from './signup-protocols'
import { MissingParamError,InvalidParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import {ok, serverError, badRequest} from '../../helpers/http-helper'

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
    class AddAccountStub{
       async add (account: AddAccountModel): Promise<AccountModel>{
            return new Promise(resolve => resolve(makeFakeAccount())) 
        }  
     }
       return new AddAccountStub()
}

const makeValidation = (): Validation =>{
    class ValidationStub{
        validate (input: any): Error {
            return null 
        }  
     }
       return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
})

const makeFakeRequest = (): HttpRequest =>( {
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})


interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator 
    addAccountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const validationStub = makeValidation()
    const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

    return{
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub
    }
}

describe('SingUp Controller', () => {
    //name test
    test('Should return 400 if no name is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
       
    })
    //email
    test('Should return 400 if no email is provided', async () => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
       
    })
    //password
    test('Should return 400 if no password is provided', async() => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
       
    })
     //password Confirmation
     test('Should return 400 if no password Confirmation is provided', async() => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
       
    })
    //verificação se a confirmação do password é igual ao password
    test('Should return 400 if  password Confirmation fails', async() => {
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
     
    })
    // email validation
    test('Should return 400 if an invalid email is provided',async () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) //serve para mocar o validator se n da pau kkkkk porra manguinhu
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
       
    })
      // email validation shold call verifica se o email é o correto
      test('Should call EmailValidator with correct email', async() => {
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
          sut.handle(makeFakeRequest())
        expect(isValidSpy).toHaveBeenLastCalledWith('any_email@mail.com')
    })

       //erro de servidor com email
       test('Should return 500 if EmailValidator throws',async () => {
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('null')))
       
        
    })

    test('Should return 500 if AddAccount throws', async() => {
        const {sut, addAccountStub} = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async()=>{
            return new Promise((resolve, reject)=> reject(new Error())) 
        })
   
        const httpResponse = await  sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new ServerError('null')))
       
    })

    test('Should call AddAccount with correct values',async () => {
        const {sut, addAccountStub} = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        sut.handle(makeFakeRequest())
        expect(addSpy).toHaveBeenLastCalledWith({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        })
    })

    test('Should return 200 if an valid data is provided',async () => {
        const {sut} = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(ok(makeFakeAccount()))
        
    })

    test('Should call Validation with correct value',async () => {
        const {sut, validationStub} = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    })

    test('Should return 400 if validation return error',async () => {
        const {sut, validationStub} = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
        
    })

})