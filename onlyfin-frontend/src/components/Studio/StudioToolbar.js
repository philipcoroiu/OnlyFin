import React from 'react';

export default function StudioToolbar(props) {

    const [inputs, setInputs] = React.useState([])

    /**
     * TODO: adapt this method for creation of new categories. Can be also used for new "series"
     */
    function addInput() {
        setInputs(prevInputs => [...prevInputs, <input type="text" placeholder="Input 1" />])
    }
    function deleteInput() {
        setInputs(prevInputs => {
            let newInputs = [];
            for (let i = 0; i < prevInputs.length-1; i++) {
                newInputs[i] = prevInputs[i]
            }
            return newInputs
        })
    }

    return (
        <div className="studio--sidebar">
            <div className="studio--sidebar--header">
                <select className="studio--sidebar--select" name="typeOfDiagram" onChange={props.function} >
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="column">Column</option>
                </select>

                {/* <div className="studio--sidebar--buttons">
                    <button onClick={addInput}>Add</button>
                    <button onClick={deleteInput}>Remove</button>
                </div> */}

                <input
                    type="text"
                    placeholder="Name"
                    name="nameOfDiagram"
                    onChange={props.function}
                    value={props.name}
                />

                <input
                    type="text"
                    placeholder="yAxis"
                    name="valueTitle"
                    onChange={props.function}
                    value={props.valueName}
                />
            </div>
            <div className="toolbar--columns">
                <div className="toolbar--xaxis">
                    <h2>xAxis</h2>
                </div>
                <div className="toolbar--categories">
                    <h2>Categories</h2>
                </div>
            </div>
            {inputs}
        </div>
    );
}
