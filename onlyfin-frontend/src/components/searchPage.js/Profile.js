import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png";
import {Link} from "react-router-dom";

export default function Profile(props) {

    const [isSubscribed, setIsSubscribed] = React.useState(props.isSubscribed(props.name) ? "Unsubscribe" : "Subscribe");



    function handleOnClick() {
        props.onClick();

        if(props.isSubscribed(props.name)) {
            setIsSubscribed("Unsubscribe")
        } else {
            setIsSubscribed("Subscribe")
        }



    }


    return(
        <div className="searchpage--profile">
            <img src={Avatar} width="50px"/>
            <Link to={`${props.name}`}>
                <h2>{props.name}</h2>
            </Link>
            {/*<button onClick={handleOnClick}>{isSubscribed}</button>*/}
        </div>
    )
}