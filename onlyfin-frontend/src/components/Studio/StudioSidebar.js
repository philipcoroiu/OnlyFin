import React from 'react';

export default function StudioSidebar() {
    return (
        <div className="studio--sidebar">
            <select>
                <option value="Line">Line</option>
                <option value="Bar">Bar</option>
                <option value="Column">Column</option>
            </select>
            <input type="text" placeholder="Input 1" />
            <input type="text" placeholder="Value 1" />
            <input type="text" placeholder="Input 2" />
            <input type="text" placeholder="Value 2" />
            <input type="text" placeholder="Input 3" />
            <input type="text" placeholder="Value 3" />
        </div>
    );
}
