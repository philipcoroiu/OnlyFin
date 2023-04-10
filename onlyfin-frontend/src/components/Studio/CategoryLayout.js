import React from "react"
import XaxisInput from "./XaxisInput";
import YaxisInput from "./YaxisInput"

export default function CategoryLayout(props) {

    //Collection of xAxis buttons
    const [xAxisInputButtons, setxAxisInputButtons] = React.useState([]);

    //Collection of yAxis buttons
    const [yAxisInputButtons, setyAxisInputButtons] = React.useState([]);

    const handleAddXaxisInput = (event) => {
        const input = event.target.value;

        setxAxisInputButtons(prevState => [...prevState, <XaxisInput placeholder="value"/>]);
        setyAxisInputButtons(prevState => [...prevState, <YaxisInput placeholder="value"/>]);
    }

    const handleRemoveXaxisInput = () => {
        setxAxisInputButtons(prevState => prevState.slice(1));
        setyAxisInputButtons(prevState => prevState.slice(1));
    }

    const handleInput = (event) => {
        const input = event.target.value;
        const id = props.id;

        props.changeName(input, id);
    }

    return (
        <>
                <div className="toolbar--value">
                    <div className="toolbar--yaxis--title">
                        <h2>Value</h2>
                    </div>
                    {yAxisInputButtons}
                </div>
            <div>LayoutID(layout): {props.id}</div>
            <div>x-axis input: {}</div>
        </>
    )
}
/*
<input type="text"
       placeholder="Category"
       name={`category${props.id}`}
       id={props.id}
       onChange={handleInput}
/>

<div className="toolbar--axis--name">
                <input
                    type="text"
                    placeholder="yAxis"
                    name="valueTitle"
                    onChange={handleInput}
                    value={props.valueName}
                />

            </div>

 */