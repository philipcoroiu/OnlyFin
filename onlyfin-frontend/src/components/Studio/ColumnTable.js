import React, { useState } from "react";

export default function ColumnTable(props) {
    const [categoryCount, setCategoryCount] = useState(1);
    const [datasets, setDatasets] = useState([{ name: "", data: Array(categoryCount).fill("") }]);
    const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
    const handleCategoryCountChange = (count) => {
        if (count > categoryCount) {
            props.handleCategoryCountIncrease(count);
        } else if (count < categoryCount) {
            props.handleCategoryCountDecrease(count);
        }
        setCategoryCount(count);
        setDatasets(datasets.map(dataset => {
            const newData = [...dataset.data];
            if (newData.length < count) {
                newData.push(...Array(count - newData.length).fill(""));
            } else if (newData.length > count) {
                newData.splice(count);
            }
            return { ...dataset, data: newData };
        }));
    };

    const handleDatasetAdd = () => {
        setDatasets([...datasets, { name: "", data: Array(categoryCount).fill("") }]);
        props.handleDatasetAdd();
    }

    const handleDatasetRemove = (indexToRemove) => {
        setDatasets(datasets.filter((_, index) => index !== indexToRemove));
        setActiveDatasetIndex(0);
        props.handleDatasetRemove(indexToRemove);
    }

    const handleDatasetNameChange = (index, name) => {
        setDatasets(datasets.map((dataset, i) => i === index ? { ...dataset, name } : dataset));
        props.handleDatasetNameChange(index, name);
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
        props.handleDatasetDataChange(index,dataIndex,value)
    }

    const handleCategoryNameChange = (index, name) => {
        props.handleCategoryNameChange(index, name)
    }
    const handleDatasetTabClick = (index) => {
        setActiveDatasetIndex(index);
    }

    const handleYAxisNameChange = (name) => {
        props.handleYAxisNameChange(name)
    }

    return (
        <div className="studio-values">
            <div className="studio--category-container">
                <h2>Categories</h2>
                <div className="category-y-axis-input">
                    <input placeholder={"y-axis"} onChange={(event) => handleYAxisNameChange(event.target.value)}/>
                </div>
                <div className="studio--category-count-btn">

                    <button onClick={() => handleCategoryCountChange(Math.max(1, categoryCount - 1))}>-</button>
                    <button onClick={() => handleCategoryCountChange(categoryCount + 1)}>+</button>
                </div>
                <div className="category-input-fields">
                    {Array.from({ length: categoryCount }, (_, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Category ${index + 1}`}
                            onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                        />
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