import React from "react"

export default function CategoryButton(props) {

    const [buttonValue, setButtonValue] = React.useState(props.value);


    function handleButtonValue(input) {
        setButtonValue(input)
    }

    function placeholderValue() {
        if(props.value === props.id)
            return "Untitled"
        else {
            return props.value
        }
    }


    return (
        <div>
            <button key={props.key} id={props.id} value={props.value} onClick={props.onClick}> {placeholderValue()}</button>
        </div>
    )
}