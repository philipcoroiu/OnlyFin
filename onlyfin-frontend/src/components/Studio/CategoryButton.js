import React from "react"

export default function CategoryButton(props) {

    const [buttonValue, setButtonValue] = React.useState(props.value);

    /*
    function handleButtonValue(input) {
        setButtonValue(input)
    }
    ¨
     */

    return (
        <div>
            <button key={props.key} id={props.id} value={props.value} onClick={props.onClick}>ButtonID: {buttonValue}</button>
        </div>
    )
}