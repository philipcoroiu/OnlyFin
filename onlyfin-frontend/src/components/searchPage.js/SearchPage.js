import React, {useEffect} from "react"
import Avatar from "../../images/avatar.png"
import Sidebar from "../dashboard/DashboardSidebar"
import SearchBar from "./SearchBar";
import axios from "axios";
import Profile from "./Profile";

export default function SearchPage() {

    const [searchData, setSearchData] = React.useState();

    useEffect(() => {
        const fetchData = async () => {
            
        };

        fetchData();
    }, []);

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

                console.log('API response:', response.data);
                setSearchData(response.data)

            })
            .catch(error => {

                console.error('API error:', error);

            });
    };


    return(
        <div>
            <Sidebar/>
            <SearchBar onSearch={onSearch}/>
            <Profile />
        </div>

    )
}