import React from "react"
import {Link, NavLink} from "react-router-dom";
import Dashboard from "../../assets/images/Dashboard.png";
import Discover from "../../assets/images/Discover.png";
import Visualize from "../../assets/images/Visualize.png";
import Monetize from "../../assets/images/Monetize.jpg";

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

                <div className="welcome-section-two">
                    <div className="welcome-section-two-content-left">
                        <h2>Discover <span>world-class</span> analysts</h2>
                        <p>Find and follow world-class stock market analysts. Access strategies and insights from brilliant analysts with a proven track record of success.</p>
                    </div>
                    <div className="welcome-section-two-content-right">
                        <img src={Discover} alt="Discover" />
                    </div>
                </div>

                <div className="welcome-section-three">
                    <div className="welcome-section-three-content-left">
                        <img src={Visualize} alt="Discover" />
                    </div>
                    <div className="welcome-section-three-content-right">
                        <h2><span>Visualize</span> and Share Your Analysis</h2>
                        <p>Visualize and share your stock market analysis with unprecedented power. Gain recognition, build your expert reputation, and empower yourself with data-driven insights.</p>
                    </div>
                </div>

                <div className="welcome-section-two">
                    <div className="welcome-section-two-content-left">
                        <h2>Discover <span>world-class</span> analysts</h2>
                        <p>Find and follow world-class stock market analysts. Access strategies and insights from brilliant analysts with a proven track record of success.</p>
                    </div>
                    <div className="welcome-section-two-content-right">
                        <img src={Monetize} alt="Monetize" />
                    </div>
                </div>

            </div>
        </div>

    )
}