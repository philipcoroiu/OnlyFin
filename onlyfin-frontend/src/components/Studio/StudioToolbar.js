import React from 'react';
import ColumnTable from "./ColumnTable"
import PieTable from "./PieTable"
import StandardToolbar from "./StandardToolbar"

export default function StudioToolbar(props) {
    const [categories, setCategories] = React.useState(props.categories)
    const tableType = "column";
    let table;

    function handleCategoryCountIncrease(count){
        props.handleCategoryCountIncrease(count);
    }

    function handleCategoryCountDecrease(count){
        props.handleCategoryCountDecrease(count);
    }

    function handleDatasetAdd() {
        props.handleDatasetAdd();
    }

    function handleDatasetRemove(indexToRemove) {
        props.handleDatasetRemove(indexToRemove);
    }

    function handleDatasetDataChange(index, dataIndex, value){
        props.handleDatasetDataChange(index, dataIndex, value);
    }

    function handleDatasetNameChange(index, name){
        props.handleDatasetNameChange(index, name);
    }

    function handleCategoryNameChange(index, name){
        props.handleCategoryNameChange(index, name)
    }

    function handleChartNameChange(name){
        props.handleChartNameChange(name)
    }

    function handleYAxisNameChange(name){
        props.handleYAxisNameChange(name)
    }

    if (tableType === "column") {
        table = <ColumnTable
            handleCategoryCountIncrease={handleCategoryCountIncrease}
            handleCategoryCountDecrease={handleCategoryCountDecrease}
            handleDatasetAdd={handleDatasetAdd}
            handleDatasetRemove={handleDatasetRemove}
            handleDatasetDataChange={handleDatasetDataChange}
            handleDatasetNameChange={handleDatasetNameChange}
            handleCategoryNameChange={handleCategoryNameChange}
            handleYAxisNameChange={handleYAxisNameChange}
        />;
    } else if (tableType === "pie") {
        table = <PieTable />;
    }

    return (
        <>
            <StandardToolbar
                handleChartNameChange={handleChartNameChange}
            />
            <div className="table">
                {table}
            </div>
        </>
    )
}

