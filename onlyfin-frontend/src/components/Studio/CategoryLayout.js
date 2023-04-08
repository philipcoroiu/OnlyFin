import React from "react"

export default function CategoryLayout(props) {

    const handleInput = (event) => {
        const input = event.target.value;
        const id = props.id;

        props.changeName(input, id);
    }

    return (
        <>

            <div className="toolbar--columns">
                <div className="toolbar--xaxis">
                    <h2>xAxis</h2>
                    <input placeholder="Value"/>
                </div>
                <div className="toolbar--value">
                    <h2>Value</h2>
                    <input placeholder="Value"/>
                </div>
            </div>
            <div>LayoutID(layout): {props.id}</div>
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