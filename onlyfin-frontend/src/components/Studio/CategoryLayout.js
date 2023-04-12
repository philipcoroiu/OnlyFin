import React from "react"
import XaxisInput from "./XaxisInput";
import YaxisInput from "./YaxisInput"
import {defaultKeyMap} from "@testing-library/user-event/dist/keyboard/keyMap";

export default function CategoryLayout(props) {

    const layoutID = props.layoutID

    return <input placeholder={props.value}/>

}

