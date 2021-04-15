import React from 'react'
import Styles from './login-styles.scss'
import Spinner from '@/presentation/pages/components/spinner/spinner'
import LoginHeader from '../components/login-header/login-header'
import Footer from '@/presentation/pages/components/footer/footer'

const Login: React.FC = () => {
    return (
        <div className={Styles.login}>
            <LoginHeader />
         <form className={Styles.form}>
            <h2>Login</h2>
            <div className={Styles.inputWrap}>
            <input type="email" name="email" id="" placeholder="Digite o seu e-mail"/>
            <span className={Styles.status}>🖕</span>
            </div>
            <div className={Styles.inputWrap}>
            <input type="password" name="password" id="" placeholder="Digite a sua senha"/>
            <span className={Styles.status}>🖕</span>
            </div>
            <button type="submit" className={Styles.submit}>Entrar</button>
            <span className={Styles.link}>Criar Conta</span>
            <div className={Styles.errorWrap}>
                <Spinner className={Styles.spinner}/>
                <span className={Styles.error}>Erro</span>
            </div>
         </form>
          <Footer />
        </div>
    )
}
export default Login
