import React from "react"
import {Link, NavLink} from "react-router-dom";
import mallDashboard from "../../images/mallDashboard.png";
import studioPic from "../../images/studio.png";

export default function Home() {
    return (
        <div className="welcome">
            <nav className="welcome--navbar">
                <h2 className="welcome--navbar--title">OnlyFin</h2>
                <ul className="navbar--text">
                    <li>
                        <NavLink to='/'>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Dashboard">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="Login">
                            Login
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="welcome--hero">
                <div className="welcome--hero--text">
                    <h1>Welcome to my website</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <Link to='Register'>
                    <button>Get Started</button>
                </Link>
                <img className="welcome--hero--image" src={studioPic}/>
                <img className="welcome--hero--image" src={mallDashboard}/>
            </div>
        </div>

    )
}