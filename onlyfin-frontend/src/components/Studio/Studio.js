import React, {useState} from "react"
import StudioToolbar from "./StudioToolbar";
import Chart from "./Chart"
import {Link, NavLink} from "react-router-dom";
import axios from "axios"
import StudioNavbar from "./StudioNavbar";
import "./Studio.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function Studio() {


    const colorscheme = [
        {index: 0, color: "#b0ffa6"},
        {index: 1, color: "#ff6363"},
        {index: 2, color: "#f7ff87"},
        {index: 3, color: "#ffb164"},
        {index: 4, color: "#5d8eff"},
    ];
    const [categoryCount, setCategoryCount] = useState(1)
    const [studioChart, setStudioChart] = useState({
        chart: {
            type: "line",
            style:{
                fontFamily: "Tahoma"
            }
        },
        style:{
            borderColor:"#1A1616"
        },
        title: {
            text: "",
            style: {
                color: "#1A1616",
                fontWeight: "lighter"
            }
        },
        xAxis: {
            categories: ["Category 1"],
            labels:{
                style:{
                    color: "#1A1616"
                }
            },
            gridLineColor: "#1A1616"
        },
        yAxis: {
            title: {
                text: "",
                style: {
                    color: "#1A1616"
                }
            },
            gridLineColor: "#1A1616",
            labels:{
                style:{
                    color: "#1A1616"
                }
            }
        },
        labels:{
            style: {
                color: "#1A1616"
            }
        },
        series: [{
            name: "name",
            data: [""],
            borderWidth: 0,
            color: "#b0ffa6",
        }]
    });

    function handleCategoryCountDecrease(count) {
        setCategoryCount(count);
        setStudioChart(prevState => {
            const updatedSeries = prevState.series.map(series => {
                const updatedData = [...series.data];
                updatedData.pop();
                return { ...series, data: updatedData };
            });
            const updatedCategories = [...prevState.xAxis.categories];
            updatedCategories.pop();
            return {
                ...prevState,
                series: updatedSeries,
                xAxis: {
                    ...prevState.xAxis,
                    categories: updatedCategories
                }
            };
        });
    }

    function handleCategoryCountIncrease(count){
        setCategoryCount(count);
        setStudioChart(prevState => {
            const categories = [...prevState.xAxis.categories, `Category ${prevState.xAxis.categories.length + 1}`];
            const series = prevState.series.map(series => ({
                ...series,
                data: [...series.data, ""]
            }));
            return {
                ...prevState,
                xAxis: {
                    ...prevState.xAxis,
                    categories: categories
                },
                series: series
            };
        });
    }

    function handleDatasetAdd(){
        const colorIndex = studioChart.series.length % colorscheme.length;
        const color = colorscheme[colorIndex].color;

        const newSeries = {
            name: "name",
            data: Array(categoryCount).fill(""),
            borderWidth: 0,
            color: color
        };

        setStudioChart(prevState => ({
            ...prevState,
            series: [
                ...prevState.series,
                newSeries
            ]
        }));
    }
    function handleDatasetRemove(indexToRemove){
        setStudioChart(prevState => {
            const filteredSeries = prevState.series.filter((_, index) => index !== indexToRemove);
            return {
                ...prevState,
                series: filteredSeries
            }
        });
    }
    function handleDatasetDataChange(index, dataIndex, value){
        setStudioChart(prevChart => {
            const seriesToUpdate = {...prevChart.series[index]};
            seriesToUpdate.data[dataIndex] = parseInt(value);
            const updatedSeries = [...prevChart.series];
            updatedSeries[index] = seriesToUpdate;
            return {
                ...prevChart,
                series: updatedSeries
            }
        });
    }

    function handleDataSetNameChange(index, name) {
        setStudioChart(prevChart => {
            const updatedSeries = prevChart.series.map((series, i) => {
                if (i === index) {
                    return { ...series, name };
                }
                return series;
            });
            return { ...prevChart, series: updatedSeries };
        });
    }

    function handleCategoryNameChange(index, name) {
        setStudioChart(prevChart => {
            const updatedXAxis = {
                ...prevChart.xAxis,
                categories: [
                    ...prevChart.xAxis.categories.slice(0, index),
                    name,
                    ...prevChart.xAxis.categories.slice(index + 1),
                ]
            };
            return {
                ...prevChart,
                xAxis: updatedXAxis,
            };
        });
    }

    function handleChartNameChange(name) {
        setStudioChart(prevState => ({
            ...prevState,
            title: {
                ...prevState.title,
                text: name
            }
        }));
    }

    function handleYAxisNameChange(name) {
        setStudioChart(prevState => {
            return {
                ...prevState,
                yAxis: {
                    ...prevState.yAxis,
                    title: {
                        text: name,
                        style: {
                            color: "#FF8C00"
                        }
                    }
                }
            };
        });
    }

    function postChart(){
        const chartToSend = studioChart;

        chartToSend.chart.width = 365;
        chartToSend.chart.height = 345;

        const postChart ={
            category_id: 37,
            module_type: "column",
            content: chartToSend
        }

        axios.post("http://localhost:8080/studio/createModule", postChart)
    }

    return (
        <>
            <StudioNavbar />
            <div className="studio--container">
                <div ref={(chartContainer) => { if (chartContainer && chartContainer.chart) { chartContainer.chart.reflow(); } }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={studioChart}
                    /></div>
                <div className="studio--toolbar">
                    <StudioToolbar
                        handleCategoryCountIncrease={handleCategoryCountIncrease}
                        handleCategoryCountDecrease={handleCategoryCountDecrease}
                        handleDatasetAdd={handleDatasetAdd}
                        handleDatasetRemove={handleDatasetRemove}
                        handleDatasetDataChange={handleDatasetDataChange}
                        handleDatasetNameChange={handleDataSetNameChange}
                        handleCategoryNameChange={handleCategoryNameChange}
                        handleChartNameChange={handleChartNameChange}
                        handleYAxisNameChange={handleYAxisNameChange}
                    />
                </div>
                <button onClick={() => postChart()}> post </button>
            </div>
        </>
    )
}
