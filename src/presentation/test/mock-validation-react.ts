import { ValidationR } from '@/presentation/protocols'

export class ValidationStubReact implements ValidationR {
    errorMessage: string

    validate (fieldName: string, fieldValue: string): string {
            return this.errorMessage
    }
}
