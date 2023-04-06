import React from "react"
import Sidebar from "./StudioToolbar";
import Chart from "./Chart"
import {Link, NavLink} from "react-router-dom";

export default function Studio() {
    /**
     * TODO: needs to be updated simultaneously with StudioToolbar and Chart
     */
    const [sendData, setSendData] = React.useState({
        nameOfDiagram: "",
        valueTitle: "",
        typeOfDiagram: "",
        categories: [{},{
            name: "Revenue",
            data: [10,3,7]
        }]
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
                <Link to="Dashboard">
                    <button className="studio--navbar--button">Dashboard</button>
                </Link>
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