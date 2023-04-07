import React from "react"

export default function CategoryLayout(props) {

    const [layoutInfo, setLayoutInfo] = React.useState(/*{id:props.id, name:props.valueName}*/)

    const handleInput = (event) => {
        const input = event.taget.value;

    }

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
            <div>LayoutInfo: {layoutInfo}</div>
        </>
    )
}