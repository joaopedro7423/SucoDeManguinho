import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Login } from '@/presentation/pages/pages'
import '@/presentation/pages/styles/global.scss'

const Router: React.FC = () => {
    return (
       <BrowserRouter>
        <Switch>
            <Route path="/login" exact component={Login} />
        </Switch>
       </BrowserRouter>
    )
}

export default Router
