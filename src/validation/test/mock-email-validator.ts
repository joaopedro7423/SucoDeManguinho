import { EmailValidator } from '@/validation/protocols/email-validator'

// cria uma variavel  recebe nenhum parametro : retorna o azul ae kkkk
export const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
