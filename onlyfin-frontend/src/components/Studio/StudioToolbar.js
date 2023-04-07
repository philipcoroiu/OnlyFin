import React from 'react';
import CategoryLayout from "./CategoryLayout";

export default function StudioToolbar(props) {

    /**
     * Stores all the info related to the chart.
     */
    const [chartInfo, setChartInfo] = React.useState(props.categories)

    /**
     * Stores all the category layouts
     */
    const [chartCategoryLayout, setChartCategoryLayout] = React.useState([<CategoryLayout
        key={0}
        id={0}
    />])

    /**
     * When you click "add" a new category button is created
     * and stored here
     */
    const [categoryButton, setCategoryButton] = React.useState([<button key="0" id="0" onClick={() => handleLayout("0")}>ButtonID: 0</button>])

    /**
     * Stores all the values of the category layout
     */
    const [layoutInfo, setLayoutInfo] = React.useState({})

    /**
     * Stores the ID of the current category layout
     */
    const [layoutID, setLayoutID] = React.useState(0)


    /**
     * Changes the name of the chart
     * @param event
     */

    function changeName(){

        setLayoutInfo(prevState => prevState)
    }

    /**
     * Adds a category layout when "add" has been pressed
     */
    function addCategoryLayout() {
        setChartCategoryLayout(prevInputs =>
            [...prevInputs,
                <CategoryLayout
                    key={prevInputs.length}
                    id={prevInputs.length}
                    function={changeName}
                />]
        )

        createCategoryButton();
    }

    /**
     * Create new category button
     */
    function createCategoryButton() {
        setCategoryButton(prevState =>
            [...prevState,
                <button
                    key={prevState.length}
                    id={prevState.length}
                    onClick={() => handleLayout(prevState.length)}
                >ButtonID: {prevState.length}</button>])
    }

    /**
     * Sets the current layoutID when category button is pressed
     * @param id
     */
    function handleLayout(id){
        setLayoutID(id)
    }

    function deleteInput(id) {
        setChartCategoryLayout(prevInputs => {
            let newInputs = [];
            for (let i = 0; i < prevInputs.length-1; i++) {
                newInputs[i] = prevInputs[i]
            }
            return newInputs
        })
        setCategoryButton(prevState => {
            let newInputs = [];
            for (let i = 0; i < prevState.length-1; i++) {
                newInputs[i] = prevState[i]
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


                <input
                    type="text"
                    placeholder="Name"
                    name="nameOfDiagram"
                    onChange={props.function}
                    value={props.name}
                />


            </div>

            <div className="toolbar--categories">
                {categoryButton}
                <div className="studio--sidebar--buttons">
                    <button onClick={addCategoryLayout}>Add</button>
                    <button onClick={deleteInput}>Remove</button>
                </div>
            </div>

            {chartCategoryLayout[layoutID]}
            <div>LayoutID(state): {layoutID}</div>
            <div>CategoryButton.length: {categoryButton.length}</div>

        </div>
    );
}
