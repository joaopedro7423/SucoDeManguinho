import { FieldValidation } from '@/validation/protocols/field-validation'
import { RequiredFieldValidation, EmailValidationR, MinLengthValidation } from '@/validation/validatorsReact'

export class ValidationBuilder {
    private constructor (
        private readonly fieldName: string,
        private readonly validations: FieldValidation[]
        ) {}

    static field (fieldName: string): ValidationBuilder {
       return new ValidationBuilder(fieldName, [])
    }

    required (): ValidationBuilder {
        this.validations.push(new RequiredFieldValidation(this.fieldName))
        return this
    }

    email (): ValidationBuilder {
        this.validations.push(new EmailValidationR(this.fieldName))
        return this
    }

    min (length: number): ValidationBuilder {
        this.validations.push(new MinLengthValidation(this.fieldName, length))
        return this
    }

    build (): FieldValidation[] {
        return this.validations
    }
}
