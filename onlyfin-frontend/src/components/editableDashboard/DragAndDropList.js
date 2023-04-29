import React, {useEffect, useState} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DraggableList = () => {

    const [dashboard, setDashboard] = useState(null);
    const [stocks, setStocks] = useState([])
    const [test, setTest] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();

    useEffect(() => {

        axios.get("http://localhost:8080/fetch-current-user-id", {withCredentials: true}).then((response) => {
            setUserId(response.data)
            console.log(response.data)
            axios.get("http://localhost:8080/dashboard/" + response.data,
                {withCredentials: true}).then((response) => {
                setDashboard(response.data);
                setStocks(response.data.stocks[0].categories[0].moduleEntities);

                console.log("response.data.stocks[1].categories[0].moduleEntities: ", response.data.stocks[0].categories[0].moduleEntities);


                setIsLoading(false);
            });
        })
    }, []);



    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newItems = Array.from(stocks);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);

        setStocks(newItems);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {stocks.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '16px',
                                            margin: '8px',
                                            width: '300px',
                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={item.content}
                                        />

                                        <p>item id: {item.id}</p>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

};

export default DraggableList;
