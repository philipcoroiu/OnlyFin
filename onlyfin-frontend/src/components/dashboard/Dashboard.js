import React from "react"
import Sidebar from "./Sidebar";
import Chart from "./Chart"

export default function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <Sidebar />

            <div className="chart">
                <Chart />
            </div>
        </div>
    )
}