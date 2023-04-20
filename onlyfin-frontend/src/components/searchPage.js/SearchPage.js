import React, {useEffect} from "react"
import SearchBar from "./SearchBar";
import axios from "axios";
import Profile from "./Profile";

export default function SearchPage() {

    const [searchData, setSearchData] = React.useState(null);
    const [subscribers, setSubscribers] = React.useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/search-all-analysts`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                const response2 = await axios.get("http://localhost:8080/fetch-current-user-subscriptions",
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                setSubscribers(response2.data)

                //console.log('All analysts:', response.data);
                setSearchData(response.data);

                console.log("Subcribers")
                console.log(response2.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const getAllAnalysts = () => {
        axios.get(`http://localhost:8080/search-all-analysts`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

        )
            .then(response => {
                console.log('API response:', response.data);
                setSearchData(response.data)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    }


    const onSearch = (searchTerm) => {
        console.log('Performing search with searchTerm:', searchTerm);

        axios.get(`http://localhost:8080/search-analyst?search=${searchTerm}`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

            )
            .then(response => {

                console.log('API response:', response.data[0].username);
                setSearchData(response.data)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    };

    const isSubscribed = (username) => {
        //console.log("userId: " + userID)

        if(subscribers.some((user) => user.username === username)) {
            console.log("subscriber username: " + username)
        }

        return subscribers && subscribers.some((user) => user.username === username)
    }

    function handleSubscription(username) {
        if(isSubscribed(username)) {
            onUnsubscribe(username)
        } else {
            onSubscribe(username)
        }
    }

    const onSubscribe = async(username) => {
        console.log('Subscribing to:', username);

        await axios.post(`http://localhost:8080/subscribe?username=${username}`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

        )
            .then(response => {

                console.log('Subscription successful');
                console.log(response)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    };

    const onUnsubscribe = async (username) => {
        console.log('Unsubscribing to:', username);

        await axios.post(`http://localhost:8080/unsubscribe?username=${username}`,
            {
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true,
            }

        )
            .then(response => {

                console.log('Unsubscription successful');
                console.log(response)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    };



    return(
        <div>
            <SearchBar onSearch={onSearch}/>

            {searchData === null ? (
                <div>Failed to get search result</div>
            ) : (
                <div>
                    {searchData.map(data => (
                        <div>
                            <Profile key={data.id} name={data.username}></Profile>
                            <button onClick={() => handleSubscription(data.username)} >{isSubscribed(data.username) ? "Unsubscribe" : "Subscribe"}</button>
                        </div>

                    ))}
                </div>
            )}



            <button onClick={getAllAnalysts}>Get all analysts</button>

            {}
        </div>

    )
}
