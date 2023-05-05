import React, {useState} from "react"
import {Responsive} from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";


export default function EditableLayout(props) {

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const standardWidth = 2;
    const standardAmountColumns = 8;

    const layout = props.category.moduleEntities.map((item, index) => ({
        i: item.id.toString(),
        x: index * standardWidth % standardAmountColumns,
        y: Math.floor(index / 5) * standardWidth,
        w: standardWidth,
        h: 2,
    }));

    const [updatedChart, setUpdateChart] = useState(

    )

    const onLayoutChange = (newLayout, event) => {
        console.log(newLayout)
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