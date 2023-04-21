import React, {useEffect} from "react"
import Avatar from "../../assets/images/avatar.png"
import axios from "axios";
import {useParams} from "react-router-dom";
import UserNotFound from "./UserNotFound"

export default function PersonalPage() {

    const { username } = useParams();
    const [userData, setUserData] = React.useState(null);
    const [error, setError] = React.useState(null)

    document.title =`${username}`

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
                if (error.response && error.response.status === 400) {
                    // Handle 400 error
                    console.error('Bad Request:', error);
                    setError("User not found")
                } else {
                    console.error('Error fetching data:', error);
                    setError("Failed to load page")
                }
            }
        };

        fetchData();
    }, [username]);


    return (
        <div>
            {error ? <p>{error}</p> : (
                <div>
                    <img src={Avatar} width="100px"/>
                    <h2>{username}</h2>
                    <p>{userData}</p>
                    <button>Subscribe</button>
                </div>
            )}
        </div>
    );
}
