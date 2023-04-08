import React from "react"
import XaxisInput from "./XaxisInput";

export default function CategoryLayout(props) {

    //Collection of xAxis buttons
    const [xAxisInputButtons, setxAxisInputButtons] = React.useState([]);

    //Collection of yAxis buttons
    const [yAxisInputButtons, setyAxisInputButtons] = React.useState([]);

    const handleAddXaxisInput = (event) => {
        const input = event.target.value;

        setxAxisInputButtons(prevState => [...prevState, <XaxisInput placeholder="value"/>]);
    }

    const handleInput = (event) => {
        const input = event.target.value;
        const id = props.id;

        props.changeName(input, id);
    }

    return (
        <>

            <div className="toolbar--columns">
                <div className="toolbar--xaxis">
                    <div className="toolbar--xaxis--title">
                        <button>-</button>
                        <h2>xAxis</h2>
                        <button onClick={handleAddXaxisInput} >+</button>
                    </div>

                    {xAxisInputButtons}
                </div>
                <div className="toolbar--value">
                    <div className="toolbar--xaxis--title">
                        <button>-</button>
                        <h2>Value</h2>
                        <button>+</button>
                    </div>
                </div>
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