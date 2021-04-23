import { ValidationR } from '@/presentation/protocols'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class ValidationCompositeReact implements ValidationR {
    constructor (private readonly validators: FieldValidation[]) {}
    validate (fieldName: string, fieldValue: string): string {
        const validators = this.validators.filter(v => v.field === fieldName) // um filters no validator aonde o validetor tiver o field == fieldname que retorna uma lista de validators
        for (const validator of validators) {
            const error = validator.validate(fieldValue)
            if (error) {
                return error.message
            }
        }
    }
}
