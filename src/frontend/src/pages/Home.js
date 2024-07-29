import React from "react";
import {VERSION} from "../components/config";

export const Home = () => {
    return (  <div className="jumbotron">
        <ul className="container">
            <li className="display-4">Cashdesk </li>

            <p className="lead">
                Версия: <strong>{VERSION}</strong>
            </p>
        </ul>
        {/*<a target="_blank" href="http://localhost:8080/repweb">Отчеты</a>*/}
    </div>)
}

export default Home