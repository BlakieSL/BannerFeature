import React, {useEffect, useState} from "react";
import axios from "axios"
const TestConnection = () => {

    const [status, setStatus] = useState('попытка соединения...')
    useEffect(() => {
        axios.get('api/test')
            .then(response => setStatus(response.data))
            .catch((error) => setStatus(`ошибка соединения: ${error}`))
    },[])
    return (<h1>Соединение с Rest Api: {status}</h1>)
}

export default TestConnection