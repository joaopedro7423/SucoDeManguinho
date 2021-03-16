import { Validation } from '@/presentation/protocols'

export const mockValidation = (): Validation => {
  class ValidationStub {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
