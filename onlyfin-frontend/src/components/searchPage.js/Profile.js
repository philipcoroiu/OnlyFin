import React from "react"
import Avatar from "../../images/avatar.png";

export default function Profile(props) {
    return(
        <div className="searchpage--profile">
            <img src={Avatar} width="50px"/>
            <h2>{props.name}</h2>
            <button>Subscribe</button>
        </div>

    )
}