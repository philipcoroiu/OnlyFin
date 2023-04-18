import React, {useEffect} from "react"
import Avatar from "../../images/avatar.png"
import Sidebar from "../dashboard/DashboardSidebar"
import axios from "axios";
import {useParams} from "react-router-dom";
import UserNotFound from "./UserNotFound"

export default function PersonalPage() {

    const { username } = useParams();
    const [userData, setUserData] = React.useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/fetch-about-me?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log('API response:', response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [username]);

    if (userData === null) {
        return <div>Loading...</div>;
    } else if (userData.error) {
        return <div>User does not exist</div>;
    } else {
        return(
            <div>
                <Sidebar/>
                <img src={Avatar} width="100px"/>
                <h2>{username}</h2>
                <p>{userData}</p>
                <button>Subscribe</button>
            </div>
        )
    }
}