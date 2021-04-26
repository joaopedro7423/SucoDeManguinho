import React from 'react'
import { makeRemoteAuthentication } from '@/main/factories/pages/usecases/authentication/remote-authentication-factory'
import { Login } from '@/presentation/pages/pages'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin: React.FC = () => {
    return (
        <Login
            authentication={makeRemoteAuthentication()}
            validation={makeLoginValidation()} />
    )
}
