import { FieldValidationSpy } from '@/validation/test/mock-field-validation-react'
import { ValidationCompositeReact } from './validation-composite-react'
import faker from 'faker'

type SutTypes = {
    sut: ValidationCompositeReact
    fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
        const fieldValidationsSpy = [
            new FieldValidationSpy(fieldName),
            new FieldValidationSpy(fieldName)
        ]
        const sut = ValidationCompositeReact.build(fieldValidationsSpy)
        return {
            sut,
            fieldValidationsSpy
        }
}

describe('ValidationComposite', () => {
    test('Should return error if any validation fails', () => {
        const fieldName = faker.database.column()
        const { sut,fieldValidationsSpy } = makeSut(fieldName)
        const errorMessage = faker.random.words()
        fieldValidationsSpy[0].error = new Error(errorMessage) // mockando o array
        fieldValidationsSpy[1].error = new Error(faker.random.words())

        const error = sut.validate(fieldName, faker.random.word())
        expect(error).toBe(errorMessage)
    })

    test('Should return error if any validation fails', () => {
        const fieldName = faker.database.column()
        const { sut } = makeSut(fieldName)
        const error = sut.validate(fieldName,faker.random.word())
        expect(error).toBeFalsy()
    })
})
