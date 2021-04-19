import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'
import { LoginHeader,Footer,FormStatus,Input } from '@/presentation/pages/components'
import Context from '@/presentation/pages/contexts/form/form-context'
import { Validation } from '@/presentation/protocols'

type Props = {
    validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
    const [state, setState] = useState({
        isLoading: false,
        email: '',
        emailError: 'Campo obrigatório',
        passwordError: 'Campo obrigatório',
        mainError: ''
    })
    useEffect(() => {
        validation.validate({ email: state.email })
    }, [state.email])

    return (
        <div className={Styles.login}>
            <LoginHeader />
            <Context.Provider value={{ state, setState }}>

            <form className={Styles.form}>
            <h2>Login</h2>
            <Input type="email" name="email" placeholder="Digite o seu e-mail" />
            <Input type="password" name="password" placeholder="Digite a sua senha" />

            <button data-testid="submit" disabled type="submit" className={Styles.submit}>Entrar</button>
            <span className={Styles.link}>Criar Conta</span>
            <FormStatus />
         </form>
            </Context.Provider>
          <Footer />
        </div>
    )
}
export default Login
