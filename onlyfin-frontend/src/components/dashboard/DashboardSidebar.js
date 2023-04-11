import React from "react"
import {Link} from "react-router-dom";
import homeIcon from "../../images/homeicon.png"
import studioIcon from "../../images/studioIcon.png"

export default function DashboardSidebar() {
    return(
        <div className="dashboard--container">
            <div className="dashboard--sidebar">

                    <Link to="/profile">
                        <button></button>
                    </Link>
                    <Link to="/" style={{ flex: 1, textAlign: 'center' }}>
                        <img src={homeIcon} alt="Home" title="Home" />
                    </Link>
                    <Link to="/Studio" style={{ flex: 1, textAlign: 'center' }}>
                        <img src={studioIcon} alt="Studio"title="Studio" />
                    </Link>
                    <Link to="/studio" style={{ flex: 1, textAlign: 'center' }}>
                        <img src={homeIcon} alt="Studio" />
                    </Link>
                    <Link to="/studio" style={{ flex: 1, textAlign: 'center' }}>
                        <img src={homeIcon} alt="Studio" />
                    </Link>

            </div>
        </div>

    )
}