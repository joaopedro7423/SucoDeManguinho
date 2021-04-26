import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@/presentation/pages/components'
import '@/presentation/pages/styles/global.scss'
import { makeLogin } from './factories/pages/login/login-factory'

ReactDOM.render(
    <Router
        makeLogin={makeLogin}
    />,
    document.getElementById('main')
)
