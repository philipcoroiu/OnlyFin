import React from "react"


export default function StockDropdownMenu() {


    const [showMenu, setShowMenu] = React.useState(false);

    function handleToggleMenu() {
        setShowMenu(!showMenu);
    }

    function handleMenuItemClick(item) {

    }

    return (
        <div>
            <button onClick={handleToggleMenu}>...</button>
            {
                showMenu && (
                    <ul>
                        <li onClick={() => handleMenuItemClick('Item 1')}>Item 1</li>
                        <li onClick={() => handleMenuItemClick('Item 2')}>Item 2</li>
                        <li onClick={() => handleMenuItemClick('Item 3')}>Item 3</li>
                    </ul>
                )
            }
        </div>
    )
}