import React from "react"

export default function CategoryLayout(props) {

    const handleInput = (event) => {
        const input = {value:event.target.value, id:props.id};

        props.changeName(input);
    }

    return (
        <>
            <div className="toolbar--axis--name">
                <input
                    type="text"
                    placeholder="yAxis"
                    name="valueTitle"
                    onChange={handleInput}
                    value={props.valueName}
                />
                <input type="text"
                       placeholder="Category"
                       name={`category${props.id}`}
                       id={props.id}
                       onChange={handleInput}
                />
            </div>

            <div className="toolbar--columns">
                <div className="toolbar--xaxis">
                    <h2>xAxis</h2>
                </div>
                <div className="toolbar--value">
                    <h2>Value</h2>
                </div>
            </div>
            <div>LayoutID(layout): {props.id}</div>
        </>
    )
}