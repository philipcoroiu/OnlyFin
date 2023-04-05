import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Chart(props) {

    const testChart = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'My Chart'
        },
        xAxis: {
            categories: ['Apples', 'Oranges', 'Bananas']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    };


    return (
        <HighchartsReact highcharts={Highcharts} options={testChart} />
    )
}