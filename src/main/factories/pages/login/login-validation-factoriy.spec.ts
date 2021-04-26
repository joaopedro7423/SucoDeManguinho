import { ValidationCompositeReact } from '@/validation/validatorsReact'
import { ValidationBuilder } from '@/validation/validatorsReact/validation-composite/builder/validation-builder'
import { makeLoginValidation } from './login-validation-factory'

describe('LoginValidationFactoryReact', () => {
    test('Should compose ValiadtionComposite with correct validation ', () => {
          const composite = makeLoginValidation()
          expect(composite).toEqual(ValidationCompositeReact.build([
              ...ValidationBuilder.field('email').required().email().build(),
              ...ValidationBuilder.field('password').required().min(5).build()
          ]))
    })
})
