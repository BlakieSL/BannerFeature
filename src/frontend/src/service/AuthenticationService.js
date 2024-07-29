import axios from 'axios'
import {httpClient} from "../constants/WindowsTypes";
import mapDispatchToProps from "react-redux/lib/connect/mapDispatchToProps";
import {bindActionCreators} from "redux";
import {setAccessEventList, setActiveWindow, setRuleTemplateParam, setTemplateBody} from "../actions";
import {connect} from "react-redux";
import {SET_ACCESS_EVENT_LIST} from "../constants/ActionTypes";

const API_URL = '/api-loyal/basic-auth'

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const TOKEN = 'token'
class AuthenticationService {

    executeBasicAuthenticationService(username, password) {
         return axios.get(`${API_URL}?username=${username}`
             , { headers: { authorization: this.createBasicAuthToken(username, password) } }
            )
    }

    executeJwtAuthenticationService(username, password) {
        console.log(username);
        return axios.post(`${API_URL}/authenticate`, {
            username,
            password
        })
    }

    createBasicAuthToken(username, password) {
        sessionStorage.setItem(TOKEN, 'Basic ' + window.btoa(username + ":" + password))
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(config, username, password) {
        const userPos = config.userPos
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        sessionStorage.setItem('userPos', JSON.stringify(userPos))
        sessionStorage.setItem('codeShop', config.codeShop)
        sessionStorage.setItem('idWorkplace', config.idWorkplace)
        sessionStorage.setItem('version', config.version)
        sessionStorage.setItem('token', this.createBasicAuthToken(username, password))
        sessionStorage.setItem('accessEventList', JSON.stringify(userPos.accessEventList.map(ae => ae.codeEvent)))
        sessionStorage.setItem('reserve',password)
        sessionStorage.setItem('reportServerIp', config.reportServerIp)
        sessionStorage.setItem('reportServerPort', config.reportServerPort)
        window.location.reload();
    }

    registerSuccessfulLoginForJwt(username, token) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosInterceptors(this.createJWTToken(token))
    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }


    logout() {
        axios.get(`${API_URL}?username=logout` ,
            { headers: { authorization: 'Basic ' + window.btoa("logout" + ":" + "void")} })
            .then(response => { })
            .finally(() => {
                sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
                window.location.reload();
            })
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return false
        return true
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) return ''
        return user
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )

    }
}


export default new AuthenticationService()

