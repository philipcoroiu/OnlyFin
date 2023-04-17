import React from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../assets/icons/homeicon.png"
import studioIcon from "../../assets/icons/studioIcon.png"
import '../../style/navBar.css';

export default function NavBar() {
    return(
        <div className="navbar-container">
            <Link to="/profile">
                <button></button>
            </Link>
            <Link to="/" >
                <img src={homeIcon} alt="Home" title="Home" />
            </Link>
            <Link to="Studio" >
                <img src={studioIcon} alt="Studio"title="Studio" />
            </Link>
            <Link to="/studio" >
                <img src={homeIcon} alt="Studio" />
            </Link>
            <Link to="Studio2" >
                <img src={homeIcon} alt="Studio" />
            </Link>
        </div>

    )
}