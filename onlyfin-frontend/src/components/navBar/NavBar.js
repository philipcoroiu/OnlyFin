import React from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../assets/icons/homeicon.png"
import studioIcon from "../../assets/icons/studioIcon.png"
import Avatar from "../../assets/images/avatar.png";

/*
Make logout function (POST / logout)
 */

export default function NavBar() {
    return (
        <div className="navbar-container">
            <Link to="/mypage">
                <span className="navbar--img--line">
                    <img src={Avatar} alt="My page" title="My page" className="navbar--img"/>
                </span>
            </Link>
            <Link to="/Dashboard">
                <img src={homeIcon} alt="Home" title="Home"/>
            </Link>
            <Link to="/Studio">
                <img src={studioIcon} alt="Studio" title="Studio"/>
            </Link>
            <Link to="/studio">
                <img src={homeIcon} alt="Studio"/>
            </Link>
            <Link to="Studio2">
                <img src={homeIcon} alt="Studio"/>
            </Link>
        </div>
    )
}