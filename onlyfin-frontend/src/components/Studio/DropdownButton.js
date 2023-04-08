import React, { useState } from "react";
//import "./DropdownButton.css"; // Import CSS file for styling

const DropdownButton = (props) => {
    const [isOpen, setIsOpen] = useState(false); // State to track dropdown open/closed state
    const [inputValue, setInputValue] = useState(""); // State to store input value


    const handleButtonClick = () => {
        setIsOpen(!isOpen); // Toggle dropdown open/closed state
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update input value in state
    };

    const handleInputSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        // Perform desired action with input value, e.g., send to API, update state, etc.
        console.log("Input value submitted:", inputValue);

        props.changeName(inputValue);

        // Close dropdown
        setIsOpen(false);
    };

    return (
        <div className="dropdown-button-container">
            {/* Button to toggle dropdown */}
            <button className="dropdown-button" onClick={handleButtonClick}>
                ...
            </button>
            {/* Dropdown menu */}
            {isOpen && (

                <form className="dropdown-menu" onSubmit={handleInputSubmit}>
                    <button onClick={props.onClickAdd} >Add Category</button>
                    <button onClick={props.onClickRemove} >Remove Category</button>
                    <input
                        type="text"
                        className="dropdown-input"
                        placeholder="Enter value"
                        value={inputValue}
                        onChange={handleInputChange}
                    />

                    <button type="submit" className="dropdown-submit">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default DropdownButton;
