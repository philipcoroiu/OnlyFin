import React from "react"
import GridLayout, {Responsive} from 'react-grid-layout';
import { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";
import Highcharts from "highcharts";


export default function EditableLayout(props) {

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const [layout, setLayout] = React.useState([]);

    const onLayoutChange = (newLayout) => {
        setLayout(newLayout);
    };


    return(
        <div>

            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={150}
                isResizable={true}
                compactType="vertical"
                onLayoutChange={onLayoutChange}
                isBounded={true}
                isDraggable={true}
            >

                {props.category.moduleEntities.map((moduleEntity) => (
                    <div key={moduleEntity.id} className="dashboard-module-container">
                        <pre>
                            <Link to={`/Studio?editModule=${true}&moduleIndex=${moduleEntity.id}`}>
                                <button>edit</button>
                            </Link>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={moduleEntity.content}
                            />
                        </pre>

                    </div>
                ))}

            </ResponsiveGridLayout>

        </div>
    )

}