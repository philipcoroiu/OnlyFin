import React from 'react';
import CategoryLayout from "./CategoryLayout";
import CategoryButton from "./CategoryButton"
import DropdownButton from "./DropdownButton"
import XaxisInput from "./XaxisInput";
import YaxisInput from "./YaxisInput";

export default function StudioToolbar(props) {

    /**
     * Stores all the info related to the chart.
     */
    //const [chartInfo, setChartInfo] = React.useState(props.series)
    const [categories, setCategories] = React.useState(props.categories)
    const [categoryInput, setCategoryInput] = React.useState([])

    const [valueInput, setValueInput] = React.useState([])

    const [yAxisInputValues, setyAxisInputValues] = React.useState([]);

    const [yAxisInputButtons, setyAxisInputButtons] = React.useState([]);

    const [test, setTest] = React.useState("test")

    function addCategory(event) {
        const {id, value} = event.target;
        let newCategory = categories
        newCategory[id] = value
        setCategories(newCategory)
        props.changeCategories("categories", newCategory)


    }

    function handleYaxisChange(event) {

        const value = event.target.value;

        setyAxisInputValues({inputLayoutID: layoutID, inputValue: value, inputID: categoryInput.length})
    }

    function addCategoryInput() {
        setCategoryInput(prevState => {
            return [...prevState,
                <input
                    key={prevState.length}
                    id={prevState.length}
                    value={categories[prevState.length]}
                    onChange={addCategory}
                />
            ]
        })
        setCategories(prevState => {
            return [...prevState, ""]
        })

        //setTest("Klickade på plus")

        addyAxisInputButton();


        //handleAddYInput();

        //addYaxisInput(layoutID);
    }

    function addyAxisInputButton() {
        setyAxisInputButtons(prevState => {
            return [...prevState,
                <CategoryLayout id={categoryInput.length} onChange={(event) => handleOnyAxisChange(event, categoryInput.length)}/>
            ]
        })
        //setTest("input created with the id: " + categoryInput.length)
    }

    function handleOnyAxisChange(event, id) {
        const value = event.target.value;
        let newObject = {inputLayoutID: layoutID, inputValue: value, inputID: id};

        setTest("LayoutID: " + layoutID + " Input ID: " + id + " value: " + value)

        if(yAxisInputValues.length === 0) {
            setyAxisInputValues(prevState => {
                return [...prevState, newObject]
            })
        }




    }

    const renderYaxisInputs = () => {

        let yInputsArray = []

        categoryInput.map((input, index) => {
            return yInputsArray.push(<input id={categoryInput.length} onChange={handleYaxisChange}/>)})

        return yInputsArray;


    }



    function removeCategoryInput() {
        setCategoryInput(prevState => {
            let newInput = []
            for (let i = 0; i < prevState.length-1; i++) {
                newInput[i] = prevState[i]
            }
            return newInput
        })

        let newCategories = [categories]
        setCategories(prevState => {
            let newCategories = []
            for (let i = 0; i < prevState.length-1; i++) {
                newCategories[i] = prevState[i]
            }
            return newCategories
        })
        props.function("categories", categories)
    }

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
     * Stores all the relevant information for the different layouts
     */
    const [yAxisInputs, setyAxisInputs] = React.useState([])

    /**
     * Add and remove methods for the layout
     */

    const handleAddYInput = () => {

        setyAxisInputs(prevState => {

            //setTest(yAxisInputs)
            return [...prevState, <CategoryLayout layoutID={layoutID} />];

            // Return the updated state
        });
    };

    /*
    KOMMENTERAR BORT MEN KANSKE BEHÖVS SENARE TILL Y-INPUT

    const renderYInputs = () => {
        setTest("RenderYInputs")
        const renderedInputs = [];
        for (let i = 0; i < yAxisInputs.length; i++) {
            if (yAxisInputs[i].layoutID === layoutID) {
                renderedInputs.push(
                    <CategoryLayout layoutID={yAxisInputs[i].layoutID} /> // value={yAxisInputs[i].value}
                );
            }
        }

        return renderedInputs;
    };

     */

    const handleRemoveYInput = () => {
        setyAxisInputs(prevState => prevState.slice(1))
    }

    function generateCategoryLayout() {
        let inputFields = [];

        for (let i = 0; i < yAxisInputs.length; i++) {
            if (yAxisInputs.layoutID === layoutID) {
                inputFields.push(yAxisInputs[i])
            }
        }

        return inputFields;
    }

    /*
    function addyAxisInput(layoutID, value) {
        setyAxisInputs(prevState => {
            // Create a copy of the previous state
            const newState = [...prevState];
            // Add a new input array to the end
            newState.push([]);
            // Return the updated state
            return newState;
        });
    }

     */


    /**
     * Changes the name of the chart
     * @param event
     */


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
        /*
        setChartCategoryLayout(prevInputs =>
            [...prevInputs,
                <CategoryLayout
                    key={prevInputs.length}
                    id={prevInputs.length}
                    yAxisInputs={yAxisInputs}

                />]
        )

         */
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
                    onClick={() => handleLayout(prevState.length)}
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
        /*
        setChartCategoryLayout(prevInputs => {
            let newInputs = [];
            for (let i = 0; i < prevInputs.length-1; i++) {
                newInputs[i] = prevInputs[i]
            }
            return newInputs
        })

         */
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


            <div className="toolbar--columns">

                <div className="toolbar--xaxis">
                    <div className="toolbar--xaxis--title">
                        <button onClick={removeCategoryInput}>-</button>
                        <h2>xAxis</h2>
                        <button onClick={addCategoryInput}>+</button>
                    </div>
                    {categoryInput}
                </div>
                    <div className="toolbar--value">
                        <div className="toolbar--yaxis--title">
                            <h2>Value</h2>
                            {/* yAxisInput here */}
                            {yAxisInputButtons}
                        </div>
                    </div>
            </div>

            <div>
                <div>LayoutID(state): {layoutID}</div>
                <div>CategoryButton.length: {categoryButton.length}</div>
                <div>categoryButton[0] name: {categoryButton[0].value}</div>
                <div>{test}</div>
            </div>



        </div>
    );
}



/*

Will generate the elements in "yAxisInputs" but the problem is that there are more
xAxisInputs than yAxisInputs.

<div>
                    {yAxisInputs.map(layout => {
                        if (layout.props.layoutID === layoutID) {
                            return <CategoryLayout value={"LayoutID: " + layout.props.layoutID} />;
                        }
                        return null;
                    })}
                </div>


 */