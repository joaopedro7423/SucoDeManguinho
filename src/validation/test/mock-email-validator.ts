import { EmailValidator } from '@/validation/protocols/email-validator'

// cria uma variavel  recebe nenhum parametro : retorna o azul ae kkkk
export class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true
  email: string

  isValid (email: string): boolean {
    this.email = email
    return this.isEmailValid
  }
}
