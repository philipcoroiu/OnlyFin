import React from "react"
import axios from "axios";
import Cookies from "js-cookie"

export default function LoginTest() {

    function getRequestTest()  {

            axios.get('http://localhost:8080/search-all-analysts' , {
                withCredentials: true
            })
                .then((response) => {
                    console.log(response)
                })
    }

    return (
        <button onClick={getRequestTest}>This is Login Test</button>
    )
}