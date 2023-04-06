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
            categories: ['2016']
        },
        yAxis: {
            title: {
                text: `${props.valueTitile}`
            }
        },
        series: [{
            name: "Revenue",
            data: [15,3,7]
        },{
            name: "sigma",
            data: [12,4,25]
        },{
            name: "Fima",
            data: [10,8,9]
        },{
            name: "ligma",
            data: [20,30,7]
        }, ]
    };


    return (
        <HighchartsReact highcharts={Highcharts} options={testChart} />
    )
}