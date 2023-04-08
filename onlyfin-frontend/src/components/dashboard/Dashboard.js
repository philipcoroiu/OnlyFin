import React from "react"
import DashboardSidebar from "./DashboardSidebar";
import DashboardChart from "./DashboardChart"

export default function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <DashboardSidebar />
            <div className="dashboard--chart--container">
                <DashboardChart />
                <DashboardChart />
                <DashboardChart />
                <DashboardChart />
            </div>

        </div>
    )
}