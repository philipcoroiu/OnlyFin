import React, {useEffect} from "react"
import axios from "axios";
import FeedModule from "./FeedModule"
import Profile from "../searchPage.js/Profile";


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

                console.log(response.data)

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
                            stock={data.stock.stock_ref_id.name}
                        />
                    </div>


                ))}
            </div>
        )}</div>
    )
}