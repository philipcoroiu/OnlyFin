import React from "react"
import Sidebar from "./StudioSidebar";
import Chart from "../dashboard/Chart"

export default function Studio() {
    return (
        <div>
            <h1>Studio</h1>
            <Sidebar/>
            <div className="chart">
                <Chart />
            </div>
        </div>
    )
}