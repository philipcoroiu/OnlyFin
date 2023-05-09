import React, {useEffect} from "react"
import axios from "axios";
import FeedModule from "./FeedModule"
import SubscriptionBar from "../feed/SubscriptionBar"
import NavBar from "../navBar/NavBar";
import SubscriptionProfile from "./SubscriptionProfile";
import icon from "../../assets/images/noContent.png"


export default function Feed() {

    const [feedData, setFeedData] = React.useState(null)

    useEffect(() => {

        const getData = async () => {
            try {

                const response = await axios.get(`http://localhost:8080/feed/all-the-things`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log("Feed charts: " + response.data)

                setFeedData(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        getData();

    }, [])


    const showFeed = []
    if (feedData) {
        for (let i = 0; i < feedData.length; i++) {
            const suggestion = feedData[i]
            showFeed.push(
                <div className="feed--new--charts">
                    <FeedModule
                        posterOfContent={feedData[i].posterOfContent.username}
                        chart={feedData[i].content}
                        postDate={feedData[i].postDate}
                        stock={feedData[i].stock.name}
                    />
                </div>
            )
        }
    }

    /*feedData.map(data => (
                        <div className="feed--new--charts">
                            <FeedModule
                                posterOfContent={data.posterOfContent.username}
                                chart={data.content}
                                postDate={data.postDate}
                                stock={data.stock.name}
                            />
                        </div>

                    ))*/

    return (
        <div className="feed">
            <NavBar/>
            <div className="feed--charts--container">{feedData === null ? (
                <div>Loading</div>
            ) : (
                <div className="feed--charts">
                    {feedData ? showFeed :
                        <div className="feed-no-content">
                            <img src={icon}/>
                            <h1>Nothing here yet</h1>
                        </div>
                    }
                </div>)}
                <div>
                    <SubscriptionBar/>
                </div>
            </div>
        </div>
    )
}