import React from "react"
import {Link} from "react-router-dom";

export default function DashboardSidebar() {
    return(
        <div className="dashboard--container">
            <div className="dashboard--sidebar">
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
        </div>

    )
}