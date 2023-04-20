import React from "react"
import Avatar from "../../assets/images/avatar.png";
import {Link} from "react-router-dom";

export default function Profile(props) {

    function handleSubscribe() {

    }

    return(
        <div className="searchpage--profile">
            <img src={Avatar} width="50px"/>
            <Link to={`${props.name}`}>
                <h2>{props.name}</h2>
            </Link>
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>

    )
}