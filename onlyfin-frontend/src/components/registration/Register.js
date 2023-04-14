import React, {useState} from 'react';
import axios from 'axios';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        axios.post('http://localhost:8080/register', {
            email: email,
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(response => {
                window.location.href = 'http://localhost:3000/Login/';
            })
            .catch(error => {
                setError(error.response.data.error);
            });
    }

    require("./Register.css");
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required/>
            </div>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange}
                       required/>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange}
                       required/>
            </div>
            {error && <div>{error}</div>}
            <button type="submit">Register</button>
        </form>
    );
}
