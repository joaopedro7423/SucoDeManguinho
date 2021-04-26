import { ValidationCompositeReact } from '@/validation/validatorsReact'
import { ValidationBuilder } from '@/validation/validatorsReact/validation-composite/builder/validation-builder'

export const makeLoginValidation = (): ValidationCompositeReact => {
    return ValidationCompositeReact.build([
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().min(5).build()
    ])
}
