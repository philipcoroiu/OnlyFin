import React from "react"
import Sidebar from "./StudioSidebar";
import Chart from "./Chart"
import {NavLink} from "react-router-dom";

export default function Studio() {
    /**
     * TODO: needs to be updated simultaneously with StudioSidebar and Chart
     */
    const [sendData, setSendData] = React.useState({
        nameOfDiagram: "",
        valueTitle: "",
        typeOfDiagram: ""
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
                typeOfDiagram={sendData.typeOfDiagram}
                function={changeStats}

            />
            <div className="chart">
                <Chart
                    diagramName={sendData.nameOfDiagram}
                    valueTitile={sendData.valueTitle}
                    typeOfDiagram={sendData.typeOfDiagram}
                />
            </div>
        </div>
    )
}