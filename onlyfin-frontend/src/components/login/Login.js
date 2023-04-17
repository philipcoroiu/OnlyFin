import React from "react"
import LoginImg from "../../assets/images/login-image.jpg"
import {Link, Outlet} from "react-router-dom"
import backgroundImage from "../../assets/images/background.jpg"

export default function Login() {
    return (
        <div className="login--container"
            /*style = {{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
            }}*/
        >
            <div className="login--credentials--container">
                <div className="login--credentials">
                    <h1>Log in</h1>
                    <h3>Welcome to OnlyFin, please put your credentials below to start using the app</h3>
                    <div className="login--inputs">
                        <input type="text" placeholder="Email"></input>
                        <input type="text" placeholder="Password"></input>
                    </div>
                    <div className="login--submit--holder">
                        <Link to="LoginTest">
                            <button className="login--submit">Submit</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div>
                {/*<img src={LoginImg} className="login--img"/>*/}
            </div>
        </div>
    )
}