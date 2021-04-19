import React,{ useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/pages/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
    const { state, setState } = useContext(Context)
    const error = state[`${props.name}Error`]
    const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
        event.target.readOnly = false
    }
    const handleChenge = (event: React.FocusEvent<HTMLInputElement>): void => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }
    const getStatus = (): string => {
        return '🖕'
    }

    const getTitle = (): string => {
        return error
    }
        return (
        <div className={Styles.inputWrap}>
        <input {...props } data-testid={props.name} readOnly onFocus={enableInput} onChange={handleChenge} />
        <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
        </div>
    )
}

export default Input
