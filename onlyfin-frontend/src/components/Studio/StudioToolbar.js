import React from 'react';
import CategoryLayout from "./CategoryLayout";
import CategoryButton from "./CategoryButton"
import DropdownButton from "./DropdownButton"

export default function StudioToolbar(props) {

    /**
     * Stores all the info related to the chart.
     */
    //const [chartInfo, setChartInfo] = React.useState(props.categories)
    const [chartInfo, setChartInfo] = React.useState({key:0, id:0, name:"Untitled"})


    /**
     * Stores all the category layouts
     */
    const [chartCategoryLayout, setChartCategoryLayout] = React.useState([<CategoryLayout
        key={0}
        id={0}
        changeName={changeName}
    />])

    /**
     * When you click "add" a new category button is created
     * and stored here
     */
    const [categoryButton, setCategoryButton] = React.useState([<CategoryButton key="0" id="0" value="0" onClick={() => setLayoutID("0")}></CategoryButton>])

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

    const [test, setTest] = React.useState("test")

    /**
     * Changes the name of the chosen category button
     * @param input
     */
    /*
    function changeName(input, id) {
        setCategoryButton(prevButtons => {
            const updatedButtons = prevButtons.map(button => {
                if (button.props.id === id) {
                    return React.cloneElement(button, { value: input });
                }
                return button;
            });
            return updatedButtons;
        });
    }

     */

    function changeName(input) {
        setCategoryButton(prevButtons => {
            const updatedButtons = prevButtons.map(button => {
                if (button.props.id === layoutID) {
                    return React.cloneElement(button, { value: input });
                }
                return button;
            });
            return updatedButtons;
        });
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
                    changeName={changeName}
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
                <CategoryButton
                    key={prevState.length}
                    id={prevState.length}
                    value={prevState.length}
                    onClick={() => setLayoutID(prevState.length)}
                ></CategoryButton>])
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

                <input
                    type="text"
                    placeholder="Name"
                    name="nameOfDiagram"
                    onChange={props.function}
                    value={props.name}
                />


                <select className="studio--sidebar--select--stocks" name="typeOfStock" onChange={props.function} /* Change function to save a stock choice */ >
                    <option value="line">Stock 1</option>
                    <option value="bar">Stock 2</option>
                    <option value="column">Stock 3</option>
                </select>

                <select className="studio--sidebar--select--stock-category" name="typeOfStockCategory" onChange={props.function} /* Change function to save a stock choice */ >
                    <option value="line">Category 1</option>
                    <option value="bar">Category 2</option>
                    <option value="column">Category 3</option>
                </select>

            </div>


            <div className="toolbar--axis--name">

                <select className="studio--sidebar--select" name="typeOfDiagram" onChange={props.function} >
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="column">Column</option>
                </select>

                <input
                    type="text"
                    placeholder="yAxis"
                    name="valueTitle"
                    onChange={props.onyAxisChange}
                    value={props.valueName}
                />

            </div>

            <div className="toolbar--categories">
                {categoryButton}
                <DropdownButton changeName={changeName} onClickAdd={addCategoryLayout} onClickRemove={deleteInput}/>
            </div>



            {chartCategoryLayout[layoutID]}
            <div>LayoutID(state): {layoutID}</div>
            <div>CategoryButton.length: {categoryButton.length}</div>
            <div>categoryButton[0] name: {categoryButton[0].value}</div>
            <div>{test}</div>


        </div>
    );
}
