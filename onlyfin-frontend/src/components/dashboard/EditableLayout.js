import React, {useState, useRef} from "react"
import {Responsive} from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";
import axios from "axios";


export default function EditableLayout(props) {

    const filteredLayout = props.dashboardLayout.filter(item => item.categoryId === props.category.id);

    const layoutRef = useRef(null);

    const [isResizable, setIsResizable] = useState(false);
    const [isDraggable, setIsDraggable] = useState(false);
    const [layout, setLayout] = useState(filteredLayout.map((item, index) => ({
        i: item.moduleId.toString(),
        x: item.x,
        h: item.h,
        y: item.y,
        w: item.w,
    })))

    const handleToggle = () => {

        if(isResizable){
            const updatedLayout = layoutRef.current.map((item) => ({
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
            ).then(
                setLayout(layoutRef.current)
            )
        }

        setIsResizable(!isResizable);
        setIsDraggable(!isDraggable);
    };

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const handleLayoutChange = (newLayout) => {
        layoutRef.current = newLayout;
    };

    return(
        <div>
            {props.ownDashboard &&
                <label className="switch">
                    <input type="checkbox" onClick={handleToggle}/>
                    <span className="slider round"></span>
                </label>
            }
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                cols={{ lg: 8, md: 6, sm: 4, xs: 2, xxs: 1 }}
                rowHeight={190}
                isResizable={isResizable}
                compactType="vertical"
                onLayoutChange={(newLayout) => handleLayoutChange(newLayout)}
                isBounded={true}
                isDraggable={isDraggable}
                autoPosition={[0, 0]}
            >

                {props.category.moduleEntities.map((moduleEntity) => (
                    <div key={moduleEntity.id} className="dashboard-module-container">
                        {props.ownDashboard &&
                            <Link to={`/Studio?editModule=${true}&moduleIndex=${moduleEntity.id}`}>
                                <button>edit</button>
                            </Link>
                        }
                        <HighchartsReact
                            containerProps={{ style: { height: "100%", weight: "100%"} }}
                            highcharts={Highcharts}
                            options={moduleEntity.content}

                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    )
}