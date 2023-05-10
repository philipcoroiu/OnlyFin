import React, {useEffect} from "react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {Link} from "react-router-dom";


export default function FeedModule(props) {

    useEffect( () => {
        console.log(props)
    }, []
    )

    return(
        <div>
            <p>{props.posterOfContent.username}</p>
            <p>{props.postDate}</p>
            <p>{props.stock}</p>
            <p>{props.category}</p>
            <HighchartsReact
                highcharts={Highcharts}
                options={props.chart}
            />
            <Link to={`../Dashboard?User=${props.posterOfContent.id}&CategoryId=${props.category.id}`}>
                <p>Check out this Dashboard</p>
            </Link>
        </div>

    )

}