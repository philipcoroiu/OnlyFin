import React from "react"

export default function CategoryLayout(props) {


    return (
        <>
            <div className="toolbar--axis--name">
                <input
                    type="text"
                    placeholder="yAxis"
                    name="valueTitle"
                    onChange={props.function}
                    value={props.valueName}
                />
                <input type="text"
                       placeholder="Category"
                       name="category"
                       id={props.id}
                       onChange={props.function}
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
        </>
    )
}