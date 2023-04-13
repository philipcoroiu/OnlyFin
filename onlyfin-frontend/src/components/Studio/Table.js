import React, { useState } from "react";

export default function Table(props) {
    const [categoryCount, setCategoryCount] = useState(1);
    const [datasets, setDatasets] = useState([{ name: "", data: Array(categoryCount).fill("") }]);
    const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
    const handleCategoryCountChange = (count) => {
        const existingData = datasets[0].data.slice(0, count);
        setCategoryCount(count);
        setDatasets(datasets.map(dataset => ({ ...dataset, data: [...existingData, ...Array(count - existingData.length).fill("")] })));
        props.handleCategoryCountChange(count)
    }

    const handleDatasetAdd = () => {
        setDatasets([...datasets, { name: "", data: Array(categoryCount).fill("") }]);
        props.handleDatasetAdd();
    }

    const handleDatasetRemove = (indexToRemove) => {
        setDatasets(datasets.filter((_, index) => index !== indexToRemove));
        setActiveDatasetIndex(0);
        props.handleDatasetRemove();
    }

    const handleDatasetNameChange = (index, name) => {
        setDatasets(datasets.map((dataset, i) => i === index ? { ...dataset, name } : dataset));
        props.changeSeriesName(index, name);
    }

    const handleDatasetDataChange = (index, dataIndex, value) => {
        setDatasets(datasets.map((dataset, i) => {
            if (i === index) {
                const newData = [...dataset.data];
                newData[dataIndex] = value;
                return { ...dataset, data: newData };
            } else {
                return dataset;
            }
        }));
        props.changeSeriesValue(index,dataIndex,value)
    }

    const handleDatasetTabClick = (index) => {
        setActiveDatasetIndex(index);
    }



    return (
        <div className="studio-values">
            <div className="studio--category-container">
                <div className="studio--category-count-btn">
                    <button onClick={() => handleCategoryCountChange(categoryCount + 1)}>+</button>
                    <h2>Categories</h2>
                    <button onClick={() => handleCategoryCountChange(Math.max(1, categoryCount - 1))}>-</button>
                </div>
                <div className="category-input-fields">
                    {Array.from({ length: categoryCount }, (_, index) => (
                        <input key={index} type="text" placeholder={`Category ${index + 1}`} />
                    ))}
                </div>
            </div>
            <div className="studio--dataset-container">
                <h2>Datasets</h2>
                <div className="add-dataset-btn">
                    <button onClick={handleDatasetAdd}>Add Dataset</button>
                </div>
                <div className="dataset-tabs-btn">
                    {datasets.map((dataset, index) => (
                        <button key={index} onClick={() => handleDatasetTabClick(index)}>{dataset.name || `Dataset ${index + 1}`}</button>
                    ))}
                </div>
                <div className="dataset-tab-container">
                    {datasets.map((dataset, index) => (
                        <div key={index} style={{ display: activeDatasetIndex === index ? "block" : "none" }}>
                            <div className="remove-dataset-btn">
                                <button onClick={() => handleDatasetRemove(index)}>Remove Dataset</button>
                            </div>
                            <div className="dataset-input-name">
                                <input type="text" placeholder="Name" value={dataset.name} onChange={(e) => handleDatasetNameChange(index, e.target.value)} />
                            </div>
                            <div className="dataset-input-fields">
                                {dataset.data.map((data, dataIndex) => (
                                    <input key={dataIndex} type="number" placeholder={`Data ${dataIndex + 1}`} value={data} onChange={(e) => handleDatasetDataChange(index, dataIndex, e.target.value)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}