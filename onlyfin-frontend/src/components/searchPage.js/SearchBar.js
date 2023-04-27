import React, { useState } from 'react';
import axios from "axios";

export default function SearchBar(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownResult, setDropdownResult] = useState([]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);

        handleDropdownResults(event.target.value);


    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSearch(searchTerm);
    };

    async function handleDropdownResults(searchTerm) {

        try {
            const response = await axios.get(`http://localhost:8080/search-analyst-include-sub-info?search=${searchTerm}`,
                {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    withCredentials: true,
                }
            );

            if(searchTerm === '') {
                setDropdownResult([]);
            } else {
                setDropdownResult(response.data)
            }


        } catch (error) {
            //setDropdownResult([]);
        }
    }



    return (
        <form onSubmit={handleSubmit} className="search--form">
            <input
                className="search--search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onInput={handleChange}
            />
            {<div>
                <ul>
                    {dropdownResult.map((option, index) => (
                        <p key={index}>{option.profile.username}</p>
                    ))}
                </ul>
            </div>}
        </form>
    );
};
