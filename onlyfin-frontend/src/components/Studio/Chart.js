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
            categories: props.categories
        },
        yAxis: {
            title: {
                text: `${props.valueTitile}`
            }
        },
        series: props.series
    };


    return (
        <HighchartsReact highcharts={Highcharts} options={testChart} />
    )
}