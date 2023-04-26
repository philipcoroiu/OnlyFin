import React, {useEffect, useRef} from "react"

export default function CategoryDropdownMenu() {

    const [showMenu, setShowMenu] = React.useState(false);
    const [inputValue, setInputValue] = React.useState();
    const dropdownRef = useRef(null);

    /**
     * The menu closes when clicked outside the dropdown menu
     */
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [dropdownRef]);

    function handleToggleMenu() {
        setShowMenu(!showMenu);
    }

    function handleMenuItemClick(item) {
        if(item === "Item 1") {
            console.log(item)
        } else if(item === "Item 2") {
            console.log(item)
        }
    }

    function handleOnSubmit(event) {
        setShowMenu(false);
        setInputValue("");
    }


    return (
        <div ref={dropdownRef}>
            <button onClick={handleToggleMenu}>...</button>
            {
                showMenu && (
                    <div style={{

                        // >>>> OBS – TA BORT DETTA VID DESIGN <<<<<

                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                        backgroundColor: "#fff",
                        padding: "10px"

                        // >>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<
                    }}>

                        <button onClick={() => handleMenuItemClick('Item 1')}>Item 1</button>
                        <button onClick={() => handleMenuItemClick('Item 2')}>Item 2</button>

                        <form onSubmit={handleOnSubmit}>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </form>
                    </div>
                )
            }
        </div>
    )
}