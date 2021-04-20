import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationStubReact } from '@/presentation/test/mock-validation-react'
import faker from 'faker'

type SutTypes = {
        sut: RenderResult
        validationStub: ValidationStubReact
}

const makeSut = (): SutTypes => {
        const validationStub = new ValidationStubReact()
        validationStub.errorMessage = faker.random.words()
        const sut = render(<Login validation={validationStub} />)
        return {
                sut,
                validationStub
        }
}

describe('Login Component', () => {
        afterEach(cleanup)

        test('Should start with initial state', () => {
           const { sut, validationStub } = makeSut()
           const errorWrap = sut.getByTestId('error-wrap')
           expect(errorWrap.childElementCount).toBe(0)
           const submitButton = sut.getByTestId('submit') as HTMLButtonElement
           expect(submitButton.disabled).toBe(true)
           const emailStatus = sut.getByTestId('email-status')
           expect(emailStatus.title).toBe(validationStub.errorMessage)
           expect(emailStatus.textContent).toBe('🖕')
           const passwordStatus = sut.getByTestId('password-status')
           expect(passwordStatus.title).toBe(validationStub.errorMessage)
           expect(passwordStatus.textContent).toBe('🖕')
        })

        test('Should show email error if Validation fails', () => {
                const { sut, validationStub } = makeSut()
                const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando o input de um campo
                const emailStatus = sut.getByTestId('email-status')
                expect(emailStatus.title).toBe(validationStub.errorMessage)
                expect(emailStatus.textContent).toBe('🖕')
        })

        test('Should show password error if Validation fails', () => {
                const { sut, validationStub } = makeSut()
                const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando o input de um campo
                const passwordStatus = sut.getByTestId('password-status')
                expect(passwordStatus.title).toBe(validationStub.errorMessage)
                expect(passwordStatus.textContent).toBe('🖕')
        })

        test('Should show valid email state if Validation succeeds', () => {
                const { sut, validationStub } = makeSut()
                validationStub.errorMessage = null // se n tem error message quer dizer que a validação passou kkkk
                const emailInput = sut.getByTestId('email')
                fireEvent.input(emailInput,{ target: { value: faker.internet.email() } }) // alterando o input de um campo
                const emailStatus = sut.getByTestId('email-status')
                expect(emailStatus.title).toBe('Tudo certo meu consagrado!!!')
                expect(emailStatus.textContent).toBe('👌')
        })

        test('Should show valid password state if Validation succeeds', () => {
                const { sut, validationStub } = makeSut()
                validationStub.errorMessage = null // se n tem error message quer dizer que a validação passou kkkk
                const passwordInput = sut.getByTestId('password')
                fireEvent.input(passwordInput,{ target: { value: faker.internet.password() } }) // alterando o input de um campo
                const passwordStatus = sut.getByTestId('password-status')
                expect(passwordStatus.title).toBe('Tudo certo meu consagrado!!!')
                expect(passwordStatus.textContent).toBe('👌')
        })
})
