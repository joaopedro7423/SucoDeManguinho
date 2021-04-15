import React from 'react'
import Styles from './login-styles.scss'
import LoginHeader from '@/presentation/pages/components/login-header/login-header'
import Footer from '@/presentation/pages/components/footer/footer'
import Input from '@/presentation/pages/components/input/input'
import FormStatus from '@/presentation/pages/components/form-status/form-status'

const Login: React.FC = () => {
    return (
        <div className={Styles.login}>
            <LoginHeader />
         <form className={Styles.form}>
            <h2>Login</h2>
            <Input type="email" name="email" placeholder="Digite o seu e-mail" />
            <Input type="password" name="password" placeholder="Digite a sua senha" />

            <button type="submit" className={Styles.submit}>Entrar</button>
            <span className={Styles.link}>Criar Conta</span>
            <FormStatus />
         </form>
          <Footer />
        </div>
    )
}
export default Login
