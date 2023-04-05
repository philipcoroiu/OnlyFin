import React from "react"
import {NavLink} from "react-router-dom"

export default function Navbar() {

    return (
        <nav className="navbar">
            <h2 className="navbar--title">OnlyFin</h2>
            <div >
                <ul className="navbar--text">
                    <li>
                        <NavLink to='/'>
                            Home
                        </NavLink>
                    </li>
                    <NavLink to="Dashboard">
                        <li>Dashboard</li>
                    </NavLink>

                    <NavLink to = "Login">
                    <li>Login</li>
                    </NavLink>
                </ul>
            </div>
        </nav>
    )
}