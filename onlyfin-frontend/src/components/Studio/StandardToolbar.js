import React, {useState} from "react";
import {Link} from "react-router-dom";

export default function StandardToolbar(props) {
    const [selectedStock, setSelectedStock] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedChartType, setSelectedChartType] = useState("");

    const handleChartNameChange = (name) => {
        props.handleChartNameChange(name)
    };

    const handleStockChange = (event) => {
        setSelectedStock(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleChartTypeChange = (event) => {
        setSelectedChartType(event.target.value);
    };


    return (
        <div className="studio--toolbar--heading">
            <input
                type="text"
                placeholder="Enter Chart Name"
                onChange={(e) => handleChartNameChange(e.target.value)}
            />
            <div className="studio--toolbar--selects">
                <select className="studio--sidebar--select" name="typeOfDiagram" onChange={props.function}>
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="column">Column</option>
                </select>
                <select value={selectedStock} onChange={handleStockChange}>
                    <option value="">Select a stock</option>
                    <option value="AAPL">AAPL</option>
                    <option value="GOOGL">GOOGL</option>
                    <option value="MSFT">MSFT</option>
                </select>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Select a category</option>
                    <option value="Sales">Sales</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Profit">Profit</option>
                </select>
            </div>
        </div>
    );
}