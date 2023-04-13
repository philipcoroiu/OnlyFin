import React, { useState } from 'react';

const DynamicTable = () => {
    const [tableData, setTableData] = useState([
        ['Header 1', 'Header 2'], // Row 1
        ['Data 1', 'Data 2'], // Row 2
    ]);

    const handleAddColumn = () => {
        const updatedTableData = tableData.map(row => [...row, '']);
        setTableData(updatedTableData);
    };

    const handleRemoveColumn = (index) => {

        const updatedTableData = tableData.map(row => {
            row.splice(index, 1);
            return row;
        });
        setTableData(updatedTableData);
    };

    const handleAddRow = () => {
        const newRow = Array(tableData[0].length).fill('');
        const updatedTableData = [...tableData, newRow];
        setTableData(updatedTableData);
    };

    const handleRemoveRow = (index) => {
        const updatedTableData = tableData.filter((row, rowIndex) => rowIndex !== index);
        setTableData(updatedTableData);
    };

    const handleCellChange = (rowIndex, colIndex, value) => {
        // Update table data for a cell at given row and column index
        const updatedTableData = tableData.map((row, rIndex) => {
            if (rIndex === rowIndex) {
                return row.map((cell, cIndex) => {
                    if (cIndex === colIndex) {
                        return value;
                    }
                    return cell;
                });
            }
            return row;
        });
        setTableData(updatedTableData);
    };

    return (
        <div>
            <table>
                <thead>
                <tr>
                    {tableData[0].map((header, colIndex) => (
                        <th key={colIndex}>
                            {header}
                            <button onClick={() => handleRemoveColumn(colIndex)}>Remove Column</button>
                        </th>
                    ))}
                    <th>
                        <button onClick={handleAddColumn}>Add Column</button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex}>
                                <input
                                    type="text"
                                    value={cell}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                />
                            </td>
                        ))}
                        <td>
                            <button onClick={() => handleRemoveRow(rowIndex)}>Remove Row</button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={tableData[0].length}>
                        <button onClick={handleAddRow}>Add Row</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
