import React from 'react'
import { Login } from '@/presentation/pages/pages'
import { AxiosHttpClient } from '@/infra/http'
import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { ValidationCompositeReact } from '@/validation/validatorsReact'
import { ValidationBuilder } from '@/validation/validatorsReact/validation-composite/builder/validation-builder'

export const makeLogin: React.FC = () => {
    const url = 'http://localhost:5050/api/login'
    const axiosHttpClient = new AxiosHttpClient()
    const remoteAuthentication = new RemoteAuthentication(url, axiosHttpClient)
    const validationComposite = ValidationCompositeReact.build([
        ...ValidationBuilder.field('email').required().email().build(),
        ...ValidationBuilder.field('password').required().min(5).build()
    ])
    return (
        <Login
            authentication={remoteAuthentication}
            validation={validationComposite} />
    )
}
