import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './login-styles.scss'
import { LoginHeader,Footer,FormStatus,Input } from '@/presentation/pages/components'
import Context from '@/presentation/pages/contexts/form/form-context'
import { ValidationR } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases/account/authentication'

type Props = {
    validation: ValidationR
    authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
    const history = useHistory()
    const [state, setState] = useState({
        isLoading: false,
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
        mainError: ''
    })
    useEffect(() => { // isso daqui acaba sobre escrevendo o campo emailError  acima
        setState({
            ...state,
            emailError: validation.validate('email', state.email), // se ouver um error vai retornar um emailError, se não vai ficar vazio mesmo
            passwordError: validation.validate('password', state.password) // se ouver um error vai retornar um emailError, se não vai ficar vazio mesmo
       })
    }, [state.email, state.password])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        try {
            if (state.isLoading || state.emailError || state.passwordError) {
                return
            }
            setState({ ...state, isLoading: true })
            const account = await authentication.auth({ // passando os parametros para o authentication
                email: state.email,
                password: state.password
            })
            localStorage.setItem('accessToken', account.accessToken)
            history.replace('/')
        } catch (error) {
            setState({
                 ...state,
                  isLoading: false,
                  mainError: error.message
                 })
        }
    }

    return (
        <div className={Styles.login}>
            <LoginHeader />
            <Context.Provider value={{ state, setState }}>

            <form data-testid="form" className={Styles.form} onSubmit={handleSubmit} >
            <h2>Login</h2>
            <Input type="email" name="email" placeholder="Digite o seu e-mail" />
            <Input type="password" name="password" placeholder="Digite a sua senha" />

            <button data-testid="submit" disabled={!!state.emailError || !!state.passwordError} type="submit" className={Styles.submit}>Entrar</button>
            <Link data-testid="signup" to="/signup" className={Styles.link}>Criar Conta</Link>
            <FormStatus />
         </form>
            </Context.Provider>
          <Footer />
        </div>
    )
}
export default Login

// disabled={!!state.emailError || !!state.passwordError} os !! serve para converter para booleano
