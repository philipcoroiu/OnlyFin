import React from "react"
import {Link} from "react-router-dom";

export default function Sidebar() {
    return(
        <div className="sidebar">
            <ul>
                <Link to="/">
                    <li>Home</li>
                </Link>

                <Link to="Studio">
                    <li>Studio</li>
                </Link>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </div>
    )
}