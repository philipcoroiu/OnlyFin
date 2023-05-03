import React, {useState} from "react"
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";


export default function TestChart() {


    const options = {
        title: {
            text: 'highcharts-react-official'
        },
        series: [{
            data: [1, 5, 3, 4]
        }]
    }

    return(
        <div className="testchart" style={{ height: '100vh', backgroundColor: "red" }}>
            <HighchartsReact
                containerProps={{ style: { height: "100%" } }}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )

}