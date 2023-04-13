import React from "react"
import LoginImg from "../../images/login-image.jpg"
import { Link, Outlet } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"

export default function Login() {

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();

    function submitLogin() {



        axios.post('http://localhost:8080/login',{
                username: username,
                password: password
        },
            {headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            })
            .then(function(response) {
                const cookies = response.headers['set-cookie'];
                const jsessionId = cookies.find(cookie => cookie.includes('JSESSIONID')).split(';')[0];
                Cookies.set('JSESSIONID', jsessionId);
            })
            .catch(function(error) {
                console.log(error)
            })
    }

    function handleUsernameInput(event) {
        setUsername(event.target.value)
    }

    function handlePasswordInput(event) {
        setPassword(event.target.value)
    }

    return(
        <div className="login--container">
            <div className="login--credentials--container">
                <div className="login--credentials">
                    <h1>Log in</h1>
                    <h3>Welcome to OnlyFin, please put your credentials below to start using the app</h3>
                    <input type="text" placeholder="Email"  onChange={handleUsernameInput}></input>
                    <input type="text" placeholder="Password" onChange={handlePasswordInput}></input>
                    <Link to="LoginTest">
                        <button onClick={submitLogin}>Submit</button>
                    </Link>
                </div>
            </div>
            <div>
                <img src={LoginImg} className="login--img"/>
            </div>
        </div>
    )
}