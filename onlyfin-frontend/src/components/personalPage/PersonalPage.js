import React, {useEffect, useState} from "react"
import Avatar from "../../assets/images/avatar.png"
import axios, {postForm} from "axios";
import {useParams} from "react-router-dom";
import NavBar from "../navBar/NavBar";

export default function PersonalPage() {

    const {username} = useParams();
    const [userData, setUserData] = React.useState();
    const [error, setError] = React.useState(null)
    const [personalName, setPersonalName] = useState()
    const [reviewText, setReviewText] = useState()

    const [isPosted, setIsPosted] = useState(false);

    document.title = `${username}`

    useEffect(() => {

        const fetchData = async () => {
            try {
                const responseTargetUser = await axios.get(`http://localhost:8080/fetch-about-me-with-sub-info?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                const responseUser = await axios.get(`http://localhost:8080/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                setPersonalName(responseUser.data)
                console.log(personalName)

                console.log('API response:', responseUser.data);
                setUserData(responseTargetUser.data);

                const responseReviews = await axios.get(`http://localhost:8080/reviews/fetch-all?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    });

                console.log(responseReviews.data)

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
    }, [personalName]);

    async function handleClick() {
        if (userData.subscribed) {
            await onUnsubscribe();
        } else {
            await onSubscribe()
        }
        await updateUserData();
    }

    const onSubscribe = async () => {

        try {
            console.log('Subscribing to:', username);

            await axios.post(
                `http://localhost:8080/subscribe?username=${username}`,
                {},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
        } catch (error) {
            console.log(error)
        }
    };

    const onUnsubscribe = async () => {
        try {
            console.log('Unsubscribing to:', username);

            await axios.delete(
                `http://localhost:8080/unsubscribe?username=${username}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true
                }
            )
        } catch (error) {
            console.log(error)
        }
    };

    async function updateUserData() {
        try {
            const response = await axios.get(`http://localhost:8080/fetch-about-me-with-sub-info?username=${username}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                });

            console.log('API response:', response.data);
            setUserData(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    if (!userData) {
        return (
            <div>Loading</div>
        )
    }


    function posted() {
        setIsPosted(true)
        post()
    }

    const post = async () => {

        try {
            console.log('Posting review to:', username);

            await axios.put(
                `http://localhost:8080/reviews/post`,
                {reviewText, username, personalName},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            )
        } catch (error) {
            console.log(error)
        }
    };

    function makeReview(e) {
        setReviewText(e.target.value)
    }


    return (
        <div>
            {error ? <p>{error}</p> : (
                <div className="personalPage">
                    <NavBar/>
                    <div className="personalPage--background">
                        <img
                            src={Avatar}
                            width="100px"
                            className="mypage--img"
                        />
                    </div>
                    <div className="mypage--text--container">
                        <h2>{username}</h2>
                        <div className="mypage--bio--container">
                            <p>{userData.aboutMe}</p>
                            <button onClick={handleClick}>{userData.subscribed ? "Unsubscribe" : "Subscribe"}</button>
                        </div>
                    </div>
                    <div className="personalPage-review-section">
                        <div className="personalPage-review-card">
                            {isPosted ?
                                (
                                    <div>
                                        <div className="personalPage-review-card-header">
                                            <img src={Avatar} style={{
                                                width: 50,
                                                height: 50
                                            }}/>
                                            <h3>{personalName}</h3>
                                        </div>
                                        <div className="personalPage-review-card-post-area">
                                            <p>{reviewText}</p>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div>
                                        <div className="personalPage-review-card-header">

                                            <img src={Avatar} style={{
                                                width: 50,
                                                height: 50
                                            }}/>
                                            <h3>{personalName}</h3>
                                        </div>
                                        <div className="personalPage-review-card-post-area">
                                            <textarea
                                                value={reviewText}
                                                onChange={makeReview}
                                                rows={5}
                                                cols={30}
                                                maxLength={700}
                                                className=""
                                            />
                                            <button onClick={posted}>Post</button>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
