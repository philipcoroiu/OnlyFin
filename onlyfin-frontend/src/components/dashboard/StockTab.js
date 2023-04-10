export default function StockTab({ stocks, activeStockTab, onStockTabClick, activeCategoryTab, onCategoryTabClick }) {
    const handleStockTabClick = (index) => {
        onStockTabClick(index);
    };

    const handleCategoryTabClick = (index) => {
        onCategoryTabClick(index);
    };

    return (
        <div className="tabs">
            {stocks.map((stock, index) => (
                <button
                    key={stock.id}
                    className={index === activeStockTab ? "active" : ""}
                    onClick={() => handleStockTabClick(index)}
                >
                    {stock.stock_ref_id.name}
                </button>
            ))}
            {stocks[activeStockTab].categories.map((category, index) => (
                <button
                    key={category.id}
                    className={index === activeCategoryTab ? "active" : ""}
                    onClick={() => handleCategoryTabClick(index)}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}

