import React, {useEffect} from "react"
import SearchBar from "./SearchBar";
import axios from "axios";
import Profile from "./Profile";

export default function SearchPage() {

    const [searchData, setSearchData] = React.useState(null);
    const [subscribers, setSubscribers] = React.useState();


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

                console.log('API response:', response.data);
                setSearchData(response.data);

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

    const isSubscribed = (userID) => {
        return subscribers && subscribers.includes(userID);
    }




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
                            <button>{isSubscribed(data.id) ? "Unsubscribe" : "Subscribe"}</button>
                        </div>


                    ))}
                </div>
            )}



            <button onClick={getAllAnalysts}>Get all analysts</button>

            {}
        </div>

    )
}
