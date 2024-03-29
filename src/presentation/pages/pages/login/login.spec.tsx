import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import Login from './login'
import faker from 'faker'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { ValidationStubReact } from '@/presentation/test/mock-validation-react'
import { AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/presentation/errors'

type SutTypes = {
        sut: RenderResult
        authenticationSpy: AuthenticationSpy
}

type SutParams = {
        validationError: string
}

const history = createMemoryHistory({
        initialEntries: ['/login']
})

const makeSut = (params?: SutParams): SutTypes => { // (params?: ...) Opcional
        const validationStub = new ValidationStubReact()
        const authenticationSpy = new AuthenticationSpy()
        validationStub.errorMessage = params?.validationError //
        const sut = render(
                <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy}/>
        </Router>)
        return {
                sut,
                authenticationSpy
        }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
       populateEmailField(sut, email)
       populatePasswordField(sut, password)
       const form = sut.getByTestId('form')
        fireEvent.submit(form)
        await waitFor(() => form)
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput,{ target: { value: email } }) // alterando/setando o input de um campo
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput,{ target: { value: password } }) // alterando/setando o input de um campo
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
        const emailStatus = sut.getByTestId(`${fieldName}-status`)
           expect(emailStatus.title).toBe(validationError || 'Tudo certo meu consagrado!!!')
           expect(emailStatus.textContent).toBe(validationError ? '🖕' : '👌')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
        const el = sut.getByTestId(fieldName)
        expect(el).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.textContent).toBe(text)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
        const button = sut.getByTestId(fieldName) as HTMLButtonElement
        expect(button.disabled).toBe(isDisabled)
      }
describe('Login Component', () => {
        afterEach(cleanup)
        beforeEach(() => {
                localStorage.clear()
        })

        test('Should start with initial state', () => {
           const validationError = faker.random.words()
           const { sut } = makeSut({ validationError })
           testErrorWrapChildCount(sut, 0)
           testButtonIsDisabled(sut, 'submit', true)
           testStatusForField(sut, 'email', validationError)
           testStatusForField(sut, 'password', validationError)
        })

        test('Should show email error if Validation fails', () => {
                const validationError = faker.random.words()
                const { sut } = makeSut({ validationError })
               populateEmailField(sut)
               testStatusForField(sut, 'email', validationError)
        })

        test('Should show password error if Validation fails', () => {
                const validationError = faker.random.words()
                const { sut } = makeSut({ validationError })
                populatePasswordField(sut)
                testStatusForField(sut, 'password', validationError)
        })

        test('Should show valid email state if Validation succeeds', () => {
                const { sut } = makeSut()
                populateEmailField(sut)
                testStatusForField(sut, 'email')
        })

        test('Should show valid password state if Validation succeeds', () => {
                const { sut } = makeSut()
                populatePasswordField(sut)
                testStatusForField(sut, 'password')
        })

        test('Should enable submit button if form is valid', () => {
                const { sut } = makeSut()
                populateEmailField(sut)
                populatePasswordField(sut)
                testButtonIsDisabled(sut, 'submit', false)
        })

        test('Should show spinner on submit', async () => {
                const { sut } = makeSut()
                await simulateValidSubmit(sut)
                testElementExists(sut, 'spinner')
        })

        test('Should call Authentication with correct values', async () => {
                const { sut, authenticationSpy } = makeSut()
                const email = faker.internet.email()
                const password = faker.internet.password()
                await simulateValidSubmit(sut, email, password)
                expect(authenticationSpy.authenticationParams).toEqual({
                        email,
                        password
                })
        })

        test('Should call Authentication only once', async () => {
                const { sut, authenticationSpy } = makeSut()
                await simulateValidSubmit(sut)
                await simulateValidSubmit(sut)
                expect(authenticationSpy.callsCount).toEqual(1)
        })

        test('Should not call Authentication if form is invalid', async () => {
                const validationError = faker.random.words()
                const { sut, authenticationSpy } = makeSut({ validationError })
                await simulateValidSubmit(sut)
                expect(authenticationSpy.callsCount).toBe(0)
        })

        test('Should present error if Authentication fails', async () => {
                const { sut, authenticationSpy } = makeSut()
                const error = new InvalidCredentialsError()
                jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
                await simulateValidSubmit(sut)
                // await waitFor(() => errorWrap) //isso serve para colocar um observer ai fica aguardando o DOM do elemento mudar quando rodar um test e aparecer para englobar um act usa isso act(...)
                testElementText(sut, 'main-error', error.message)
                testErrorWrapChildCount(sut, 1)
        })

        test('Should add access token to localstorage on success', async () => {
                const { sut, authenticationSpy } = makeSut()
                await simulateValidSubmit(sut)
                expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.authenticationModel.accessToken)
                expect(history.length).toBe(1)
                expect(history.location.pathname).toBe('/')
        })

        test('Should go to signup page', () => {
                const { sut } = makeSut()
                const register = sut.getByTestId('signup')
                fireEvent.click(register)
                // console.log(history)
                expect(history.length).toBe(2)
                expect(history.location.pathname).toBe('/signup')
        })
})
