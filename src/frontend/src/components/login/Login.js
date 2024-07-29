import React, {useState} from "react";
import AuthenticationService from "../../service/AuthenticationService";
import axios from 'axios'
import {bindActionCreators} from "redux";
import {setAccessEventList} from "../../actions";
import {connect} from "react-redux";
import {SET_ACCESS_EVENT_LIST} from "../../constants/ActionTypes";

const Login = ({setAccessEventList}) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const changeUserName = (event) => {
        setUsername(event.target.value)
    }

    const changePassword = (event) => {
        setPassword(event.target.value)
    }

    const loginClick = async (event) => {
        let config = null
        AuthenticationService
            .executeBasicAuthenticationService(username, password)
            .then(response => {
                config = response.data
                AuthenticationService.registerSuccessfulLogin(response.data, username, password)
            }).catch(err => {
                if (err.response.status === 403 ) setError("Ошибка входа. Неверные логин/пароль")
                else if (err.response.status === 500 ) setError(`Ошибка работы с сервером. ${err.response.data}`)
                else setError(`Ошибка входа. Код: ${err.response.status}. ${err.response.data}`)
            })
            .finally(() => {
            })
    }

    const onKeyPress = (event) => {
        if (event.key === 'Enter' ) {
            loginClick(event)
        }
    }

    return (
        <div className= "login-form">
            <div className= "login-error">{error}</div> <br/>
            <div className="login-body">
                <div className="login-input-panel">
                    <label className="label-login">Логин:</label> <input type="text" className="input-login" value={username} onChange={changeUserName}/>
                    <label className="label-login">Пароль:</label> <input type="password" className="input-login"  value={password} onChange={changePassword} onKeyPress={onKeyPress}/>
                </div>
                <button className="btn btn-success button-login" onClick={loginClick}>Ок</button>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    setAccessEventList: bindActionCreators(setAccessEventList, dispatch)
})
export default connect(null, mapDispatchToProps) (Login)