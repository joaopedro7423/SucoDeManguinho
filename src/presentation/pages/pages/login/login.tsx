import React, { useState } from 'react'
import Styles from './login-styles.scss'
import { LoginHeader,Footer,FormStatus,Input } from '@/presentation/pages/components'
import Context from '@/presentation/pages/contexts/form/form-context'

const Login: React.FC = () => {
    const [state] = useState({
        isLoading: false
    })
    const [errorState] = useState({
        email: 'Campo obrigatório',
        password: 'Campo obrigatório',
        main: ''
    })
    return (
        <div className={Styles.login}>
            <LoginHeader />
            <Context.Provider value={{ state, errorState }}>

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
