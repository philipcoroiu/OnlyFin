import React from "react"
import XaxisInput from "./XaxisInput";
import YaxisInput from "./YaxisInput"
import {defaultKeyMap} from "@testing-library/user-event/dist/keyboard/keyMap";

export default function CategoryLayout(props) {

    const layoutID = props.layoutID;
    let numberOfInputFields = () => {

    }



    const generateInputFields = () => {
        const inputFields = [];

        for (let i = 0; i < numberOfInputFields; i++) {
            inputFields.push(<input/>)
        }

        return inputFields;

    }

    //return {generateInputFields}

}

