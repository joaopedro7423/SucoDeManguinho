import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  // aqui se adiciona o campo para a validação
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email',new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
