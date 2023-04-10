import React from "react"
import StudioToolbar from "./StudioToolbar";
import Chart from "./Chart"
import {Link, NavLink} from "react-router-dom";
import axios from "axios"

export default function Studio() {

    /*
    const [testData, setTestData] = React.useState();

    axios.get('https://localhost:8080/dashboard/8')
        .then(function (response) {
            console.log(response)
            setTestData(response)
        })

     */


    /**
     * TODO: needs to be updated simultaneously with StudioToolbar and Chart
     */
    const [sendData, setSendData] = React.useState({
        nameOfDiagram: "",
        valueTitle: "",
        typeOfDiagram: "",
        series: [{},{
            name: "Revenue",
            data: [10,3,7]
        }],
        categories: []
    })
    console.log(sendData)

    function changeStats(event){
        const {name, value} = event.target;
        setSendData(prevState => {
            return{
                ...prevState,
                [name]: value
            }
        })
    }

    function changeStats(name, value){
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
                series={sendData.series}
                categories={sendData.categories}
                onyAxisChange={changeStats}

            />
            <div className="chart">
                <Chart
                    diagramName={sendData.nameOfDiagram}
                    valueTitile={sendData.valueTitle}
                    typeOfDiagram={sendData.typeOfDiagram}
                    series={sendData.series}
                    categories={sendData.categories}
                />
            </div>
        </div>
    )
}