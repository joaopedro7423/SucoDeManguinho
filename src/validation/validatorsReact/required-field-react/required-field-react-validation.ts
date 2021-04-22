import { FieldValidation } from '@/validation/protocols/field-validation'
import { RequiredFieldError } from '../../errors'

export class RequiredFieldValidation implements FieldValidation {
    constructor (readonly field: string) {}

    validate (value: string): Error {
        return value ? null : new RequiredFieldError()
    }
}
//  return value? null : new RequiredFieldError()
//  se o value existir retorna null se não retorna um error
