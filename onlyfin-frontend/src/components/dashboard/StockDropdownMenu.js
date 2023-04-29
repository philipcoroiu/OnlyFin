import React, {useEffect, useRef} from "react"
import axios from "axios";


export default function StockDropdownMenu(props) {

    const [showMenu, setShowMenu] = React.useState(false);
    const dropdownRef = useRef(null);
    const [refStocks, setRefStocks] = React.useState(null);
    const [refStockButtons, setRefStockButtons] = React.useState(null);


    /**
     * The menu closes when clicked outside the dropdown menu
     */
    useEffect(() => {
        axios.get("http://localhost:8080/dashboard/getStockRef", {withCredentials: true}).then((response) => {
            setRefStocks(response.data);
            console.log("stockRefs: ", response.data);


        })
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [dropdownRef]);

    /**
     * Toggle switch for when the dropdown menu
     * should be shown or not
     */
    function handleToggleMenu() {
        setShowMenu(!showMenu);
    }

    /**
     * Function for handling click inside of dropdown menu
     * @param item represents the button clicked
     */
    function handleMenuItemClick(item) {
        if(item === "Item 1") {
            console.log(item)
        } else if(item === "Item 2") {
            console.log(item)
        }
    }


    return (
        <div ref={dropdownRef}>
            <button onClick={handleToggleMenu}>...</button>

            {showMenu && (

                <ul style={{

                        // >>>> OBS – TA BORT DETTA VID DESIGN <<<<<

                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        backgroundColor: "red",
                        padding: "10px",
                        zIndex: 10000,
                        position: "absolute",
                        overflow: "auto",
                        height: "450px",
                        width: "300px"

                        // >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<
                    }}>
                    <div><input placeholder={"Search for a stock"}/></div>
                        <button onClick={() => props.removeStock()}>Remove</button>

                        {refStocks.map((stock) => (
                            <div className="dashboard-stock-add-container" key={stock.id}>
                                <li>{stock.name}</li>
                                <button value={stock.id}
                                        onClick={() => props.addStock(stock.id)}

                                >Add</button>
                            </div>
                        ))}
                    </ul>
                )
            }

        </div>
    )
}