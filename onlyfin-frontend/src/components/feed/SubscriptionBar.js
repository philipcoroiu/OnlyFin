import React, {useEffect} from "react"
import axios from "axios";
import SubscriptionProfile from "./SubscriptionProfile";
import FeedModule from "./FeedModule";


export default function SubscriptionBar() {

    const [subData, setSubData] = React.useState(null);

    useEffect( () => {

        const getData = async () => {
            try {

                const response = await axios.get(`http://localhost:8080/user-subscription-list-sorted-by-postdate`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log("Subscription bar data: ",response.data)

                setSubData(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        getData();

    }, [])

    return(
        <div>{subData === null ? (
            <div>Loading</div>
        ) : (
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "4px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                width: "300px",
                float: "left",
                marginRight: "20px"
            }}>
                {subData.map(data => (
                    <div>
                        <SubscriptionProfile username={data.username}/>
                    </div>

                ))}
            </div>
        )}</div>
    )
}