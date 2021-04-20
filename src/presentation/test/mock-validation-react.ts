import { ValidationR } from '@/presentation/protocols'

export class ValidationSpyReact implements ValidationR {
    errorMessage: string
    fieldName: string
    fieldValue: string
    validate (fieldName: string, fieldValue: string): string {
            this.fieldName = fieldName
            this.fieldValue = fieldValue
            return this.errorMessage
    }
}
