import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

/*import { SearchBox } from 'react-search-box';*/

export default function EditableDashboard() {
    document.title = "Dashboard"
    const [dashboard, setDashboard] = useState(null);
    const [stocks, setStocks] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();

    useEffect(() => {

        axios.get("http://localhost:8080/fetch-current-user-id", {withCredentials: true}).then((response) => {
            setUserId(response.data)
            console.log(response.data)
            axios.get("http://localhost:8080/dashboard/" + response.data,
                {withCredentials: true}).then((response) => {
                setDashboard(response.data);
                setStocks(response.data.stocks);

                console.log("response.data.stocks: ", response.data.stocks);


                setIsLoading(false);
            });
        })
    }, []);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Check if the item was dropped outside the list or if the source and destination are the same
        if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
            return;
        }

        // Extract category IDs from the droppableIds
        const sourceCategoryId = parseInt(source.droppableId.split("-")[1]);
        const destCategoryId = parseInt(destination.droppableId.split("-")[1]);

        // Find the source and destination categories
        const sourceCategory = stocks.flatMap(stock => stock.categories).find(category => category.id === sourceCategoryId);
        const destCategory = stocks.flatMap(stock => stock.categories).find(category => category.id === destCategoryId);

        // Create a deep copy of the source and destination moduleEntities arrays
        const sourceModuleEntities = [...sourceCategory.moduleEntities];
        const destModuleEntities = [...destCategory.moduleEntities];

        // Remove the dragged item from the source array and insert it into the destination array
        const [removed] = sourceModuleEntities.splice(source.index, 1);
        destModuleEntities.splice(destination.index, 0, removed);

        // Update the stocks state with the updated moduleEntities arrays
        const updatedStocks = stocks.map(stock => ({
            ...stock,
            categories: stock.categories.map(category => {
                if (category.id === sourceCategoryId) {
                    return { ...category, moduleEntities: sourceModuleEntities };
                }
                if (category.id === destCategoryId) {
                    return { ...category, moduleEntities: destModuleEntities };
                }
                return category;
            }),
        }));

        setStocks(updatedStocks);
    };



    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                {stocks.map((stock, stockIndex) => (
                    <div key={stock.id}>
                        <h3>Stock name: {stock.name}</h3>
                        {stock.categories.map((category, categoryIndex) => (
                            <Droppable key={category.id} droppableId={`category-${category.id}`}>
                                {(provided, snapshot) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        <h4>Category: {category.name}</h4>
                                        <ul className="module-entities">
                                            {category.moduleEntities.map((moduleEntity, moduleIndex) => (
                                                <Draggable key={moduleEntity.id} draggableId={moduleEntity.id} index={moduleIndex}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                borderRadius: "4px",
                                                                padding: "16px",
                                                                margin: "8px",
                                                                width: "300px",
                                                                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                                                            }}
                                                        >
                                                            <li>{moduleEntity.name}</li>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </ul>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                ))}
            </DragDropContext>
        </div>

   )
}