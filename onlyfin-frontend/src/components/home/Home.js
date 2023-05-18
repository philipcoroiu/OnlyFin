import React from "react"
import {Link, NavLink} from "react-router-dom";
import Dashboard from "../../assets/images/Dashboard.png";
import studioPic from "../../assets/images/studio.png";

export default function Home() {
    document.title = "OnlyFin"
    return (
        <div className="welcome">
            <nav className="welcome--navbar">
                <h2 className="welcome--navbar--title">OnlyFin <span>beta</span></h2>
                <ul className="navbar--text">
                    <li>
                        <NavLink to="Login">
                            Log in
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="welcome--hero">
                <h1 className="welcome--hero--fin">The OnlyFans<br/>of investing</h1>
                <p className="welcome--hero--p">Make money on your stock<br/>market analysis</p>
                <img className="welcome--hero--image" src={Dashboard}/>
                <h2>...and share it with people around the world on your dashboard</h2>
                <img className="welcome--hero--image"  src={studioPic}/>
                <Link to='Register'>
                    <button className="welcome--hero--button">Get Started</button>
                </Link>
            </div>
        </div>

    )
}