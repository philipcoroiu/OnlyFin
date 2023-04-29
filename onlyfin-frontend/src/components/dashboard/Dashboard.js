import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../navBar/NavBar";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import CategoryDropdownMenu from "./CategoryDropdownMenu";
import StockDropdownMenu from "./StockDropdownMenu";
/*import { SearchBox } from 'react-search-box';*/

export default function Dashboard() {
    document.title = "Dashboard"
    const [dashboard, setDashboard] = useState(null);
    const [activeStockTab, setActiveStockTab] = useState(null);
    const [activeCategoryTab, setActiveCategoryTab] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [currentStockId, setCurrentStockId] = useState(null);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);

    useEffect(() => {

        axios.get("http://localhost:8080/fetch-current-user-id", {withCredentials: true}).then((response) => {
            setUserId(response.data)
            console.log(response.data)
            axios.get("http://localhost:8080/dashboard/" + response.data,
                {withCredentials: true}).then((response) => {
                setDashboard(response.data);
                console.log("response.data ",response.data);

                if(response.data.stocks.length != 0){
                    setCurrentStockId(response.data.stocks[0].id)

                    console.log(response.data.stocks[0].categories)
                    if(response.data.stocks[0].categories.length != 0){
                        setCurrentCategoryId(response.data.stocks[0].categories[0].id)
                    }
                }


                setIsLoading(false);
            });
        })
    }, []);

    const handleStockTabClick = (index) => {
        //changes the button index from the input
        setActiveStockTab(index);

        //sets the category click to null
        handleCategoryTabClick(null);

        //sets the current id of the selected stock (needs to be able to be null)
        if (index != null){
            setCurrentStockId(dashboard.stocks[index].id);
        }
        else {
            setCurrentStockId(null)
        }
    };

    const handleCategoryTabClick = (index) => {

        console.log("index: " + index)
        console.log("activeCategoryTab: " + activeCategoryTab)
        console.log("activeStockTab: " + activeStockTab)
        console.log("currenCategoryID: " + currentCategoryId)
        console.log("currenStockID: " + currentStockId)

        //changes the activecategorytab to index.
        setActiveCategoryTab(index);

        //index is null
        if (index === null) return;


        if(activeStockTab == dashboard.stocks[activeStockTab].categories.length != 0){
            setCurrentCategoryId(dashboard.stocks[activeStockTab].categories[index].id)
        }
        else setCurrentStockId(null);

    };

    async function handleAddCategory(categoryName) {
        if (categoryName != ""){
            await axios.post("http://localhost:8080/studio/createCategory",
                {
                    name: categoryName,
                    stock_id: currentStockId
                },
                {withCredentials: true}
            )
            refreshDashboard(activeStockTab, 0);
        }
        else console.log("need to enter a string")
        console.log("clicked add")

    }

    async function handleChangeCategoryName(inputName){
        await axios.put(
            "http://localhost:8080/studio/updateCategoryName",
            {
                id: currentCategoryId,
                name: inputName
            },
            {withCredentials: true}
        )
        refreshDashboard(activeStockTab,activeCategoryTab)
    }

    async function handleRemoveCategory() {
        await axios.delete(
            `http://localhost:8080/studio/deleteCategory/` + currentCategoryId,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }

        )
        refreshDashboard(activeStockTab, 0);

        //bugg i koden, klickar man remove category två gånger i rad utan att göra något innan så tror den
        //att current category id är det samma som för den förra

        console.log("clicked delete")
        console.log(currentStockId)
        console.log(currentCategoryId)
    }

    async function refreshDashboard(StockIndex, categoryIndex){
        await axios.get("http://localhost:8080/dashboard/" + userId,
            {withCredentials: true}).then((response) => {
                setDashboard(response.data);
            ;})
        if(activeStockTab != StockIndex && activeStockTab != null){
            handleStockTabClick(StockIndex)
            handleCategoryTabClick(categoryIndex)
        }
        else handleCategoryTabClick(categoryIndex)
    }

    async function handleAddStock(stockRefId){
        await axios.post("http://localhost:8080/studio/createStock",
            {
                dashboardId: dashboard.id,
                stockRefId: stockRefId
            },
            {withCredentials: true}
            )
        refreshDashboard(dashboard.stocks.length-1,0)
    }
    async function handleRemoveStock(){
        await axios.delete(
            `http://localhost:8080/studio/deleteStock/` + currentStockId,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            }
        )
        refreshDashboard(null,null)

    }

    if (isLoading) {
        return <div className="dashboard-is-loading">Loading dashboard...</div>;
    }

    const { stocks } = dashboard;

    return (
        <div className="dashboard">
            <NavBar />
            <div className="dashboard-content-wrapper">
                <div className="dashboard-button-underlay"></div>
                <Link to="/profile_page">
                    <button className="dashboard-profile-button">
                    </button>
                </Link>
                <div className="dashboard-stock-tab-container">
                    <div className="dashboard-stock-tab-buttons">
                        {stocks && stocks.map((stock, index) => (
                            <button
                                key={stock.id}
                                className={index === activeStockTab ? "active" : ""}
                                onClick={() => handleStockTabClick(index)}
                            >
                                {stock.stock_ref_id.name}
                            </button>
                        ))}
                        <StockDropdownMenu
                            addStock={handleAddStock}
                            removeStock={handleRemoveStock}
                        />
                    </div>
                    <div className="stock-tab-content">
                        <div className="dashboard-category-tab-container">

                            <div className="dashboard-category-tab-buttons">

                                {activeStockTab != null && stocks.length > 0 && stocks[activeStockTab].categories.map((category, index) => (
                                    <button
                                        key={category.id}
                                        className={index === activeCategoryTab ? "active" : ""}
                                        onClick={() => handleCategoryTabClick(index)}
                                    >
                                        {category.name}
                                    </button>

                                ))}
                                {stocks.length > 0 && activeStockTab != null && (
                                    <CategoryDropdownMenu
                                        addCategory={handleAddCategory}
                                        removeCategory={handleRemoveCategory}
                                        changeCategoryName={handleChangeCategoryName}
                                    />
                                )}
                            </div>
                            <div className="dashboard-category-tab-content">
                                {activeStockTab != null && stocks.length > 0 && stocks[activeStockTab].categories && stocks[activeStockTab].categories.length > 0 && stocks[activeStockTab].categories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className={`module-container ${
                                            index === activeCategoryTab ? "active" : ""
                                        }`}
                                    >
                                        {category.moduleEntities.map((moduleEntity) => (
                                            <div key={moduleEntity.id} className="dashboard-module-container">
                                                <pre>
                                                    <HighchartsReact
                                                        highcharts={Highcharts}
                                                        options={moduleEntity.content}/>
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
        </div>
    );
}