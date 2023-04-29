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

   return (

       <div>
           {/* >>>>>>>>>>>>>>>>>>>> Stock <<<<<<<<<<<<<<<<<<<<<<<  */}
           <DragDropContext>
               <Droppable droppableId="characters">
                   {(provided, snapshot) => (
                       <div {...provided.droppableProps}
                            ref={provided.innerRef} >

                           <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                               {stocks.map((stock, index) => (
                                   <div>

                                       {/* >>>>>>>>>>>>>>>>>>>> Category <<<<<<<<<<<<<<<<<<<<<<<  */}
                                        {stock.categories.map((category, index) => (
                                            <div>
                                                {/* >>>>>>>>>>>>>>>>>>>> Module <<<<<<<<<<<<<<<<<<<<<<<  */}
                                                {category.moduleEntities.map((moduleEntity, index) => (
                                                    <div>
                                                        <Draggable key={index} draggableId={index} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div

                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}

                                                                    style={{border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    padding: '16px',
                                                                    margin: '8px',
                                                                    width: '300px',
                                                                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>

                                                                    <li > hej



                                                                    </li >
                                                                </div>
                                                                )}
                                                        </Draggable>
                                                    </div>
                                                ))}
                                            </div>
                                       ))}
                                   </div>
                               ))}

                           </ul>
                       </div>

                   )}
               </Droppable>
           </DragDropContext>
       </div>

   )
}