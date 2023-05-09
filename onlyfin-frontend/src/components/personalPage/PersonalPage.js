import React, {useEffect, useState} from "react";
import Avatar from "../../assets/images/avatar.png";
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
    const [reviews, setReviews] = useState()
    const [isVisible, setIsVisible] = React.useState(false)
    const textareaRef = React.useRef()
    const autoscrollRef = React.useRef(null)

    document.title = `${username}`

    const [scrollPos, setScrollPos] = useState(0);
    const [scrollDir, setScrollDir] = useState(true); // true for right, false for left

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            // Get the reference to the element that needs to be scrolled
            const element = autoscrollRef.current;
            if (element) {

                // Check the direction of scrolling and update the scroll position accordingly
                if (scrollDir) {
                    if (element.scrollLeft < element.scrollWidth - element.clientWidth) {
                        setScrollPos(scrollPos + 1);
                        element.scrollLeft += 1; // scroll to the right
                    } else {
                        setScrollDir(false); // change direction to left
                    }
                } else {
                    if (element.scrollLeft > 0) {
                        setScrollPos(scrollPos - 1);
                        element.scrollLeft -= 1; // scroll to the left
                    } else {
                        setScrollDir(true); // change direction to right
                    }
                }
            }
        }, 50);

        return () => clearInterval(scrollInterval);
    }, [scrollPos, scrollDir]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseReviews = await axios.get(`http://localhost:8080/reviews/fetch-all?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseReviews => {
                    if (responseReviews.data !== null) {
                        console.log("test", responseReviews.data)
                        setReviews(responseReviews.data)
                        if (reviews !== null) {
                            setIsVisible(true)
                            console.log(isVisible, "is Visible")
                        }
                    }
                });

                const responseIsPosted = await axios.get(`http://localhost:8080/reviews/get-my-review?targetUsername=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseIsPosted => {
                    if (responseIsPosted.status == 200) {
                        setIsPosted(true)
                    }
                });


            } catch (error) {
                if (error.response && error.response.status === 500) {
                    setIsPosted(false)
                    console.error('Bad Request:', error);
                }

                if (error.response && error.response.status === 400) {
                    // Handle 400 error
                    console.error('Bad Request:', error);
                    setError("User not found")
                }
            }
        }
        fetchData()
        console.log("page is updated")
    }, [username])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const responseTargetUser = await axios.get(`http://localhost:8080/fetch-about-me-with-sub-info?username=${username}`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseTargetUser => {
                    console.log(responseTargetUser.data)
                    setUserData(responseTargetUser.data);
                });

                const responseUser = await axios.get(`http://localhost:8080/principal-username`,
                    {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        withCredentials: true,
                    }).then(responseUser => {

                    console.log('You are:', responseUser.data);
                    setPersonalName(responseUser.data)

                });


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
    }, []);

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


    async function posted() {
        setIsPosted(true)
        await post()
    }

    const post = async () => {

        try {
            console.log('Posting review to:', username);

            await axios.put(
                `http://localhost:8080/reviews/post`,
                {targetUsername: username, reviewText: reviewText},
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.log(error)
        }
    };

    function makeReview(e) {
        setReviewText(e.target.value)
    }

    const showReviews = []
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i]
        showReviews.push(
            <div key={review.id} className="personalPage-review-card">
                <div className="personalPage-review-card-header">
                    <img src={Avatar} style={{
                        width: 50,
                        height: 50
                    }}/>
                    <h3>{review.author}</h3>
                </div>
                <div className="personalPage-review-card-post-area">
                    <p>{review.reviewText}</p>
                </div>
            </div>
        )
    }


    const revertIsPosted = () => {
        setIsPosted(false)
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
                            <div className="mypage-buttons">
                                <button
                                    onClick={handleClick}>{userData.subscribed ? "Unsubscribe" : "Subscribe"}
                                </button>
                                <button onClick={revertIsPosted} className="personalPage-review-card-edit">
                                    Edit review
                                </button>
                            </div>
                        </div>
                    </div>
                    {isPosted ?
                        (
                            <div className="personalPage-review-section"
                                 ref={autoscrollRef}
                                 style={{overflowX: "auto", whiteSpace: "nowrap"}}
                            >
                                {isVisible && showReviews}
                            </div>
                        )
                        :
                        (
                            <div className="personalPage-review-section"
                                 style={{overflowX: "auto", whiteSpace: "nowrap"}}
                            >
                                <div className="personalPage-review-card">

                                    <div className="personalPage-review-card-header">

                                        <img src={Avatar} style={{
                                            width: 50,
                                            height: 50
                                        }}/>
                                        <h3>{personalName}</h3>
                                    </div>
                                    <div className="personalPage-review-card-post-area">
                                            <textarea
                                                ref={textareaRef}
                                                value={reviewText}
                                                onChange={makeReview}
                                                rows={5}
                                                cols={30}
                                                maxLength="150"
                                                className="review-text-area"
                                            />
                                        <button onClick={posted} >Post</button>
                                    </div>
                                </div>
                                {isVisible && showReviews}

                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
}
