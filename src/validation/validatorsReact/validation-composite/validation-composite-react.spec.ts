import { FieldValidationSpy } from '../test/mock-field-validation-react'
import { ValidationCompositeReact } from './validation-composite-react'

type SutTypes = {
    sut: ValidationCompositeReact
    fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
        const fieldValidationsSpy = [
            new FieldValidationSpy('any_field'),
            new FieldValidationSpy('any_field')
        ]

        const sut = new ValidationCompositeReact(fieldValidationsSpy)
        return {
            sut,
            fieldValidationsSpy
        }
}

describe('ValidationComposite', () => {
    test('Should return error if any validation fails', () => {
        const { sut,fieldValidationsSpy } = makeSut()
        fieldValidationsSpy[0].error = new Error('first_error_message') // mockando o array
        fieldValidationsSpy[1].error = new Error('second_error_message')

        const error = sut.validate('any_field', 'any_value')
        expect(error).toBe('first_error_message')
    })
})
