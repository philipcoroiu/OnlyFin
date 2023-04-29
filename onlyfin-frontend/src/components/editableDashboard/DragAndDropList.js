import React, { useEffect, useState } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DraggableList = () => {
    const [dashboard, setDashboard] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState();

    useEffect(() => {
        axios
            .get("http://localhost:8080/fetch-current-user-id", {
                withCredentials: true,
            })
            .then((response) => {
                setUserId(response.data);
                axios
                    .get("http://localhost:8080/dashboard/" + response.data, {
                        withCredentials: true,
                    })
                    .then((response) => {
                        setDashboard(response.data);
                        setStocks(response.data.stocks[1].categories[0].moduleEntities);
                        setIsLoading(false);
                    });
            });
    }, []);

    const layout = stocks.map((item, index) => ({
        i: item.id.toString(),
        x: index * 2 % 10,
        y: Math.floor(index / 5) * 2,
        w: 2,
        h: 2,
    }));

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 12 }}
            rowHeight={150}
            isResizable={true}
        >
            {stocks.map((item) => (
                <div key={item.id} style={{ background: "#fff", padding: "8px" }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={item.content}
                    />
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};

export default DraggableList;
