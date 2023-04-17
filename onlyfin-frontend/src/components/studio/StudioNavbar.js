import {Link} from "react-router-dom";
import React from "react";

export default function StudioNavbar(){



return (
    <>
        <div className="studio-navbar">
            <h1>Studio</h1>
            <Link to="/Dashboard">
                <button className="studio--navbar--button">Dashboard</button>
            </Link>
        </div>
    </>
    )
}
