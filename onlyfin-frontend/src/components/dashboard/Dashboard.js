import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardSidebar from "./DashboardSidebar";
import './Dashboard.css';
import {Link} from "react-router-dom";
import DashboardChart from "./DashboardChart";
/*import { SearchBox } from 'react-search-box';*/

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [activeStockTab, setActiveStockTab] = useState(0);
    const [activeCategoryTab, setActiveCategoryTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    let userId = 8;
    const userName = null;

    useEffect(() => {
        //userId = axios.get("http://localhost:8080/fetch-current-user-id");

        axios.get("http://localhost:8080/dashboard/" + userId).then((response) => {
            setDashboard(response.data);
            setIsLoading(false);
        });
    }, []);

    const handleStockTabClick = (index) => {
        setActiveStockTab(index);
        setActiveCategoryTab(0); // reset the active category tab when changing stock tab
    };

    const handleCategoryTabClick = (index) => {
        setActiveCategoryTab(index);
    };

    if (isLoading) {
        return <div className="isLoading">Loading dashboard...</div>;
    }

    const { stocks } = dashboard;

    return (
        <>
            <DashboardSidebar />
                <div className="content-wrapper">
                    <div className="button-underlay"></div>
                    <Link to="/profile_page">
                        <button className="profile-button">
                        </button>
                    </Link>
                    <div className="stock-tab-container">
                        <div className="stock-tab-buttons">
                            {stocks.map((stock, index) => (
                                <button
                                    key={stock.id}
                                    className={index === activeStockTab ? "active" : ""}
                                    onClick={() => handleStockTabClick(index)}
                                >
                                    {stock.stock_ref_id.name}
                                </button>
                            ))}
                        </div>
                        <div className="stock-tab-content">
                            <div className="category-tab-container">
                                <div className="category-tab-buttons">
                                    {stocks[activeStockTab].categories.map((category, index) => (
                                        <button
                                            key={category.id}
                                            className={index === activeCategoryTab ? "active" : ""}
                                            onClick={() => handleCategoryTabClick(index)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="category-tab-content">
                                    {stocks[activeStockTab].categories.map((category, index) => (
                                        <div
                                            key={category.id}
                                            className={`module-container ${
                                                index === activeCategoryTab ? "active" : ""
                                            }`}
                                        >
                                            {category.moduleEntities.map((moduleEntity) => (
                                                <div key={moduleEntity.id} className="module-entity-container">
                                                    <pre>
                                                        <DashboardChart moduleItem={moduleEntity.content}/>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </>
    );
}