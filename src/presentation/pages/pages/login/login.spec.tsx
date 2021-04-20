import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationStubReact } from '@/presentation/test/mock-validation-react'
import faker from 'faker'

type SutTypes = {
        sut: RenderResult
}

type SutParams = {
        validationError: string
}

const makeSut = (params?: SutParams): SutTypes => { // (params?: ...) Opcional
        const validationStub = new ValidationStubReact()
        validationStub.errorMessage = params?.validationError //
        const sut = render(<Login validation={validationStub} />)
        return {
                sut
        }
}

describe('Login Component', () => {
        afterEach(cleanup)

        test('Should start with initial state', () => {
           const validationError = faker.random.words()
           const { sut } = makeSut({ validationError })
           const errorWrap = sut.getByTestId('error-wrap')
           expect(errorWrap.childElementCount).toBe(0)
           const submitButton = sut.getByTestId('submit') as HTMLButtonElement
           expect(submitButton.disabled).toBe(true)
           const emailStatus = sut.getByTestId('email-status')
           expect(emailStatus.title).toBe(validationError)
           expect(emailStatus.textContent).toBe('🖕')
           const passwordStatus = sut.getByTestId('password-status')
           expect(passwordStatus.title).toBe(validationError)
           expect(passwordStatus.textContent).toBe('🖕')
        })

        test('Should show email error if Validation fails', () => {
                const validationError = faker.random.words()
                const { sut } = makeSut({ validationError })
                const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando o input de um campo
                const emailStatus = sut.getByTestId('email-status')
                expect(emailStatus.title).toBe(validationError)
                expect(emailStatus.textContent).toBe('🖕')
        })

        test('Should show password error if Validation fails', () => {
                const validationError = faker.random.words()
                const { sut } = makeSut({ validationError })
                const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando o input de um campo
                const passwordStatus = sut.getByTestId('password-status')
                expect(passwordStatus.title).toBe(validationError)
                expect(passwordStatus.textContent).toBe('🖕')
        })

        test('Should show valid email state if Validation succeeds', () => {
                const { sut } = makeSut()
              const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando o input de um campo
                const emailStatus = sut.getByTestId('email-status')
                expect(emailStatus.title).toBe('Tudo certo meu consagrado!!!')
                expect(emailStatus.textContent).toBe('👌')
        })

        test('Should show valid password state if Validation succeeds', () => {
                const { sut } = makeSut()
               const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando o input de um campo
                const passwordStatus = sut.getByTestId('password-status')
                expect(passwordStatus.title).toBe('Tudo certo meu consagrado!!!')
                expect(passwordStatus.textContent).toBe('👌')
        })

        test('Should enable submit button if form is valid', () => {
                const { sut } = makeSut()
                const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando/setando o input de um campo
                const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando/setando o input de um campo
                const submitButton = sut.getByTestId('submit') as HTMLButtonElement
                expect(submitButton.disabled).toBe(false)
        })

        test('Should show spinner on submit', () => {
                const { sut } = makeSut()
                const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando/setando o input de um campo
                const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando/setando o input de um campo
                const submitButton = sut.getByTestId('submit') as HTMLButtonElement
                fireEvent.click(submitButton)
                const spinner = sut.getByTestId('spinner')
                expect(spinner).toBeTruthy()
        })
})
