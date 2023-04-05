import React from "react"
import Sidebar from "./StudioSidebar";
import Chart from "./Chart"
import {NavLink} from "react-router-dom";

export default function Studio() {

    const [sendData, setSendData] = React.useState({
        nameOfDiagram: "",
        valueTitle: ""
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

    return (
        <div>
            <div className="studio--navbar">
                <h1>Studio</h1>
                <NavLink to="Dashboard">
                    <button className="studio--navbar--button">Dashboard</button>
                </NavLink>
            </div>
            <Sidebar
                name={sendData.nameOfDiagram}
                valueName={sendData.valueTitle}
                function={changeStats}

            />
            <div className="chart">
                <Chart
                    diagramName={sendData.nameOfDiagram}
                    valueTitile={sendData.valueTitle}
                />
            </div>
        </div>
    )
}