import React from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function DashboardChart(props) {
    //change categories and series with new props as they added
    const { moduleItem } = props;

    const Chart = {
        chart: {
            type: "column",
            width: 365,
            height: 345,
        },
        title: {
            text: "Test",
            style: {
                color: "#FF8C00"
            }
        },
        xAxis: {
            categories: ['2016','2017','2018','2019','2020'],
            style: {
                color: "#FF8C00"
            }

        },
        yAxis: {
            title: {
                text: "Y-test",
                style: {
                    color: "#FF8C00"
                }
            }
        },
        labels:{
            style: {
                color: "#FF8C00"
            }
        },
        series: [{
            name: "Revenue",
            data: [15,3,7,2,2]
        },{
            name: "sigma",
            data: [12,4,25,30,30]
        },{
            name: "Fima",
            data: [10,8,9,25,23]
        },{
            name: "ligma",
            data: [20,30,7,12,32]
        }]
    };


    return (
        <div className="dashboard--chart">
            <HighchartsReact highcharts={Highcharts} options={moduleItem} />
        </div>

    )
}