import React from "react"
import LoginImg from "../../images/login-image.jpg"
import { Link, Outlet } from "react-router-dom"

export default function Login() {
    return(
        <div className="login--container">
            <div className="login--credentials--container">
                <div className="login--credentials">
                    <h1>Log in</h1>
                    <h3>Welcome to OnlyFin, please put your credentials below to start using the app</h3>
                    <input type="text" placeholder="Email"></input>
                    <input type="text" placeholder="Password"></input>
                    <Link to="LoginTest">
                        <button>Submit</button>
                    </Link>
                </div>
            </div>
            <div>
                <img src={LoginImg} className="login--img"/>
            </div>
        </div>
    )
}