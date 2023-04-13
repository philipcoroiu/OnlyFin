import React, { useState } from "react";
import { Link } from "react-router-dom";

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
        <>
            <input
                type="text"
                placeholder="Enter Chart Name"
                onChange={(e) => handleChartNameChange(e.target.value)}
            />
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
            <select value={selectedChartType} onChange={handleChartTypeChange}>
                <option value="">Select a chart type</option>
                <option value="Line">Line Chart</option>
                <option value="Bar">Bar Chart</option>
                <option value="Pie">Pie Chart</option>
            </select>
        </>
    );
}