import React from 'react'
import {NavLink} from 'react-router-dom'
import AuthenticationService, {USER_NAME_SESSION_ATTRIBUTE_NAME} from "../../service/AuthenticationService";
import {FULL_NAME} from "../config";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export const checkAccessEvent = (codeEvent) => {
    const accessEventList = JSON.parse(sessionStorage.getItem("accessEventList")) || []
    return accessEventList.map(a => a.toString()).includes(codeEvent.toString())
}

export const Navbar = () => {

    const [anchorRef, setAnchorRef] = React.useState(null);
    const [anchorLoyal, setAnchorLoyal] = React.useState(null);
    const [anchorManage, setAnchorManage] = React.useState(null);

    const handleClickRef = (event) => {
        setAnchorRef(event.currentTarget);
    };

    const handleClickLoyal = (event) => {
        setAnchorLoyal(event.currentTarget);
    };

    const handleClickManage = (event) => {
        setAnchorManage(event.currentTarget);
    };

    const handleCloseRef = () => {
        setAnchorRef(null);
    };

    const handleCloseLoyal = () => {
        setAnchorLoyal(null);
    };

    const referenceMenu = () => {
        return (
            <div  className={"nav-item"}>
                <li onClick={handleClickRef } className={"nav-link"}>
                    Справочники
                </li>
                <Menu
                    id="reference-menu"
                    anchorEl={anchorRef}
                    keepMounted
                    open={Boolean(anchorRef)}
                    onClose={handleCloseRef}
                >
                    {workplaceStatus()}
                </Menu>
            </div>
        )
        /*
        return (
            <div  className={"nav-item"}>
                <li onClick={handleClickRef } className={"nav-link"}>
                    Справочники
                </li>
                <Menu
                    id="reference-menu"
                    anchorEl={anchorRef}
                    keepMounted
                    open={Boolean(anchorRef)}
                    onClose={handleCloseRef}
                >
                    {priceType()}
                    {priceType()}
                </Menu>
            </div>
        )

         */
    }
    const priceType = () => {
        return checkAccessEvent(173) &&
            <MenuItem onClick={handleCloseRef}>
                <NavLink
                    to="/price-type"
                    exact
                >
                   Тип цены
                </NavLink>
            </MenuItem>
    }

    const workplaceStatus = () => {
        return checkAccessEvent(173) &&
            <MenuItem onClick={handleCloseRef}>
                <NavLink
                    to="/workplace-status"
                    exact
                >
                    Статус роботи кас
                </NavLink>
            </MenuItem>
    }

    return (
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/"
              exact
            >
              Главная
            </NavLink>
          </li>

           <li>
            {referenceMenu()}
           </li>

        </ul>
        <ul className="navbar-nav navbar-collapse justify-content-end">
          <li className="user-fio-header">{FULL_NAME}</li>
          <button className="btn btn-link" onClick={AuthenticationService.logout}>Выход</button>
        </ul>
      </nav>
      )
}
