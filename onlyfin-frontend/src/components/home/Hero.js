import React from "react"
import {Link} from 'react-router-dom'
import heroimage from "../../images/heroimage.png"


export default function Hero() {

    return (
        <>
            <div className="hero">
                <div className="hero--text">
                    <h1>Welcome to my website</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <Link to='Login'>
                        <button >Get Started</button>
                    </Link>
                </div>
                <img className="hero--image" src={heroimage} />
            </div>
        </>

    )
}