import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {Navbar} from "./components/navbar/Navbar";
import AuthenticationService from "./service/AuthenticationService";
import Login from './components/login/Login'
import PriceTypeList from "./components/price-type/list";
import Home from "./pages/Home";
import WorkplaceStatusList from "./components/workplace-status/list";

const App = () => {
    /*
        const router = () => {
            return (<BrowserRouter>
                <Navbar/>
                <div>
                    <Switch>
                        <Route path={'/'} exact component={PriceTypeList}/>
                        <Route path={'/price-type'} component={PriceTypeList}/>
                    </Switch>
                </div>
            </BrowserRouter>)
        }

    */
        const router = () => {
            return (<BrowserRouter>
                <Navbar/>
                <div>
                    <Switch>
                        <Route path={'/'} exact component={WorkplaceStatusList}/>
                        <Route path={'/workplace-status'} component={WorkplaceStatusList}/>
                    </Switch>
                </div>
            </BrowserRouter>)
        }

    const login = () => {
        return <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Redirect to="/" />
                </Switch>
            </BrowserRouter>
            <Login/>
        </React.Fragment>
    }

    return(
      <React.Fragment>
          {AuthenticationService.isUserLoggedIn() ?
              router()
              : login()
          }
      </React.Fragment>
  )
}

export default App
