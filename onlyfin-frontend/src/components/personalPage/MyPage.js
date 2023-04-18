import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png"
import axios from "axios";
import {useParams} from "react-router-dom";

export default function PersonalPage() {

    const { username } = useParams();
    const [userData, setUserData] = React.useState([]);

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

    if (!userData) {
        return <div>Loading...</div>;
    }

    // `http://localhost:8080/update-about-me`

    return(
        <div>
            <img src={Avatar} width="100px"/>
            <h2>{username}</h2>
            <p>{userData}</p>
            <button>Update my text</button>
        </div>
    )
}