import React from 'react';
import CategoryLayout from "./CategoryLayout";

export default function StudioToolbar(props) {

    const [chartInfo, setChartInfo] = React.useState(props.categories)

    const [chartCategoryLayout, setChartCategoryLayout] = React.useState([<CategoryLayout
        key={0}
        id={0}
    />])

    const [categoryButton, setCategoryButton] = React.useState([])

    const [layoutInfo, setLayoutInfo] = React.useState([])

    function changeName(event){
        let {id, value} = event.target
        setLayoutInfo(prevState => prevState[id] = value)
    }

    function addCategoryLayout() {
        setChartCategoryLayout(prevInputs =>
            [...prevInputs,
                <CategoryLayout
                    key={prevInputs.length+1}
                    id={prevInputs.length+1}
                    function={changeName}
                />]
        )
        setCategoryButton(prevState =>
            [...prevState,
                <button
                    key={prevState.length+1}
                    id={prevState.length+1}
                    onClick={handleLayout(prevState.length+1)}
                >{layoutInfo[layoutInfo.length]}</button>])
    }

    var number = 0
    function handleLayout(id){
        number = id;
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
                <button className="toolbar--category--button">{chartInfo[1].name}</button>
                {categoryButton}
                <div className="studio--sidebar--buttons">
                    <button onClick={addCategoryLayout}>Add</button>
                    <button onClick={deleteInput}>Remove</button>
                </div>
            </div>

            {chartCategoryLayout[number]}

        </div>
    );
}
