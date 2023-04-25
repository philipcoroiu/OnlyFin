import React, {useEffect} from "react"
import axios from "axios";
import FeedModule from "./FeedModule"
import SubscriptionBar from "../feed/SubscriptionBar"


export default function Feed() {

    const [feedData, setFeedData] = React.useState(null)

    useEffect( () => {

        const getData = async () => {
            try {

                const response = await axios.get(`http://localhost:8080/feed/all-the-things`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log(response)

                setFeedData(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        getData();

    }, [])


    return(
        <div>{feedData === null ? (
            <div>Loading</div>
        ) : (
            <div>
                {feedData.map(data => (
                    <div>
                        <FeedModule
                            posterOfContent={data.posterOfContent.username}
                            chart={data.content}
                            postDate={data.postDate}
                            stock={data.stock.name}
                        />
                    </div>

                ))}
                <div>
                    <SubscriptionBar></SubscriptionBar>
                </div>
            </div>
        )}</div>
    )
}