import React from "react"
import {Link, NavLink} from "react-router-dom";
import Dashboard from "../../assets/images/Dashboard.png";
import studioPic from "../../assets/images/studio.png";

export default function Home() {
    document.title = "OnlyFin"

    function handleClick() {
        return <Link to="Register"/>
    }

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

                <div className="welcome--hero--buttons--container">
                    <Link to="Register">
                        <div className="welcome--hero--buttons">
                            <button onClick={handleClick}>Get Started</button>
                        </div>
                    </Link>

                    <Link to="searchpage">
                        <div className="welcome--hero--buttons">
                            <button onClick={handleClick}>Explore</button>
                        </div>
                    </Link>
                </div>


                <img className="welcome--hero--image" src={Dashboard}/>

                <h2>Discover world-class analysts</h2>
            </div>
        </div>

    )
}