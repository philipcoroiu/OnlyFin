import React, {useState} from "react"
import {Responsive} from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";
import axios from "axios";


export default function EditableLayout(props) {

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const standardWidth = 2;
    const standardAmountColumns = 8;

    const filteredLayout = props.dashboardLayout.filter(item => item.categoryId === props.category.id);

    const layout = filteredLayout.map((item, index) => ({
        i: item.moduleId.toString(),
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
    }));

    const onLayoutChange = (newLayout, event) => {
        console.log(newLayout)
        console.log("dashboardLayout", props.dashboardLayout);
        console.log(props.category.id
        )

        const updatedLayout = newLayout.map((item) => ({
            moduleId: parseInt(item.i),
            categoryId: props.category.id,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h
        }))

        console.log(JSON.stringify({layoutDTO: updatedLayout}));
        axios.put(
            "http://localhost:8080/studio/updateDashboardLayout",
            updatedLayout,
            {
                headers: {
                    'Content-type': 'application/json',
                },
                withCredentials: true,
            }
        )




    };

    return(
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            cols={{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 1 }}
            rowHeight={200}
            isResizable={true}
            compactType="vertical"
            onLayoutChange={(newLayout, event) => onLayoutChange(newLayout, event)}
            isBounded={true}
            isDraggable={true}
            autoPosition={[0, 0]}

        >

            {props.category.moduleEntities.map((moduleEntity) => (
                <div key={moduleEntity.id} className="dashboard-module-container" >
                    <Link to={`/Studio?editModule=${true}&moduleIndex=${moduleEntity.id}`}>
                        <button>edit</button>
                    </Link>
                    <HighchartsReact
                        containerProps={{ style: { height: "100%", weight: "100%" } }}
                        highcharts={Highcharts}
                        options={moduleEntity.content}

                    />
                </div>
            ))}
        </ResponsiveGridLayout>
    )
}