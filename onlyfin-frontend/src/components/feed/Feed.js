import React, {useEffect} from "react"
import axios from "axios";
import FeedModule from "./FeedModule"
import SubscriptionBar from "../feed/SubscriptionBar"
import NavBar from "../navBar/NavBar";
import SubscriptionProfile from "./SubscriptionProfile";
import icon from "../../assets/images/web-design.gif"


export default function Feed() {

    const [feedData, setFeedData] = React.useState(null)

    useEffect(() => {

        const getData = async () => {
            try {

                const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/feed/all-the-things`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log(response.data)
                setFeedData(response.data)

            } catch (error) {
                console.log("All-the-things error")
                console.log(error.response)
                if(error.response && error.response.status === 403) {
                    console.log("User not logged in")
                    console.log("error.response: ", error.response)
                    //setUserNotFound(true);
                } else {
                    console.error('Error:', error.message);
                }
            }
        }

        getData();

    }, [])


    const showFeed = []
    if (feedData) {
        for (let i = 0; i < feedData.length; i++) {
            const suggestion = feedData[i]
            showFeed.push(
                <FeedModule
                    posterOfContent={feedData[i].posterOfContent}
                    chart={feedData[i].content}
                    postDate={feedData[i].postDate}
                    stock={feedData[i].stock.name}
                    category={feedData[i].category}
                />
            )
        }
    }

    return (
        <div className="feed">
            <NavBar/>
            <div className="feed--charts--container">
                {feedData === null ?
                    (
                        <div>Loading</div>
                    ) : (
                        <div className="feed--charts">
                            {feedData ? showFeed :
                                <div className="feed-no-content">
                                    <img width="100px" src={icon}/>
                                    <h1>Nothing here yet...</h1>
                                </div>
                            }
                        </div>)}
                <SubscriptionBar/>
            </div>
        </div>
    )
}