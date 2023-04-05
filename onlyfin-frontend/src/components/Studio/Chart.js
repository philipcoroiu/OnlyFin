import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Chart(props) {
    //change categories and series with new props as they added
    const testChart = {
        chart: {
            type: `${props.typeOfDiagram}`
        },
        title: {
            text: `${props.diagramName}`
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Bananas']
        },
        yAxis: {
            title: {
                text: `${props.valueTitile}`
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        },{
            name: 'Mike',
            data: [5, 19, 3]
        }]
    };


    return (
        <HighchartsReact highcharts={Highcharts} options={testChart} />
    )
}