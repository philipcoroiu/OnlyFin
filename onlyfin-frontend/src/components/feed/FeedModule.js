import React from "react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


export default function FeedModule(props) {


    return(
        <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "1rem", boxShadow: "0 2px 2px rgba(0,0,0,0.1)", maxWidth: "400px", marginTop: "40px" }}>
            <p>{props.posterOfContent}</p>
            <p>{props.postDate}</p>
            <p>{props.stock}</p>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.chart}/>
        </div>

    )

}