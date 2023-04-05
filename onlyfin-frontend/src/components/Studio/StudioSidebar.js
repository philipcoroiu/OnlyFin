import React from 'react';

export default function StudioSidebar(prep) {

    const [inputs, setInputs] = React.useState([])

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
            <select className="studio--sidebar--select" name="typeOfDiagram" onChange={prep.function} >
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="column">Column</option>
            </select>

            <div className="studio--sidebar--buttons">
                <button onClick={addInput}>Add</button>
                <button onClick={deleteInput}>Remove</button>
            </div>

            <input
                type="text"
                placeholder="Name"
                name="nameOfDiagram"
                onChange={prep.function}
                value={prep.name}
            />

            <input
                type="text"
                placeholder="Value title"
                name="valueTitle"
                onChange={prep.function}
                value={prep.valueName}
            />

            {inputs}
        </div>
    );
}
