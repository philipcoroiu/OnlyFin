import React, {useState} from "react"
import StudioToolbar from "./StudioToolbar";
import Chart from "./Chart"
import {Link, NavLink} from "react-router-dom";
import axios from "axios"

export default function Studio() {

    /**
     * TODO: needs to be updated simultaneously with StudioToolbar and Chart
     */
    const [categoryCount, setCategoryCount] = useState(1);
    const [series, setSeries] = useState([{ name: "", data: Array(categoryCount).fill("")}]);
    const [object, setObjects] = useState([{ name: "", data: []}])

    const [sendData, setSendData] = React.useState({
        nameOfDiagram: "",
        valueTitle: "",
        typeOfDiagram: "",
        series: object,
        categories: []
    })
    console.log(sendData)

    const handleCategoryCountChange = (count) => {
        const existingData = series[0].data.slice(0, count);
        setCategoryCount(count);
        setSeries(series.map(dataset => ({ ...dataset, data: [...existingData, ...Array(count - existingData.length).fill("")] })));
        setObjects()
    }

    const handleDatasetAdd = () => {
        setSeries([...series, { name: "", data: Array(categoryCount).fill("") }]);
    }
    const handleDatasetRemove = (indexToRemove) => {
        setSeries(series.filter((_, index) => index !== indexToRemove));
    }

    function changeSeriesValue(index, dataIndex, value){
        setSeries(series.map((dataset, i) => {
            if (i === index) {
                const newData = [...dataset.data];
                newData[dataIndex] = value;
                return { ...dataset, data: newData };
            } else {
                return dataset;
            }
        }));
    }

    function changeSeriesName(index, name){
        setSeries(series.map((dataset, i) => i === index ? { ...dataset, name } : dataset));
    }

    function changeStats(event){
        const {name, value} = event.target;
        setSendData(prevState => {
            return{
                ...prevState,
                [name]: value
            }
        })
    }



    return (
        <div>
            <div className="studio--navbar">
                <h1>Studio</h1>
                <Link to="Dashboard">
                    <button className="studio--navbar--button">Dashboard</button>
                </Link>
            </div>
            <StudioToolbar
                name={sendData.nameOfDiagram}
                valueName={sendData.valueTitle}
                typeOfDiagram={sendData.typeOfDiagram}
                function={changeStats}
                changeSeriesValue={changeSeriesValue}
                changeSeriesName={changeSeriesName}
                handleCategoryCountChange={handleCategoryCountChange}
                handleDatasetAdd={handleDatasetAdd}
                handleDatasetRemove={handleDatasetRemove}
                onyAxisChange={changeStats}

            />
            <div className="chart">
                <Chart
                    diagramName={sendData.nameOfDiagram}
                    valueTitile={sendData.valueTitle}
                    typeOfDiagram={sendData.typeOfDiagram}
                    series={series}
                    categories={sendData.categories}
                />
            </div>
        </div>
    )
}