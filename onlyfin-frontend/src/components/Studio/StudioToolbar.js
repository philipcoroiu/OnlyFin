import React from 'react';
import Table from "./Table"

export default function StudioToolbar(props) {
    const [categories, setCategories] = React.useState(props.categories)

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

            <Table
                changeSeriesValue={props.changeSeriesValue}
                changeSeriesName={props.changeSeriesName}
                handleCategoryCountChange={props.handleCategoryCountChange}
                handleDatasetAdd={props.handleDatasetAdd}
                handleDatasetRemove={props.handleDatasetRemove}
            />
        </div>
    );
}