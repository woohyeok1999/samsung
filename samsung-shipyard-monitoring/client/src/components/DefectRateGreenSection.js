import React, { useState, useEffect } from 'react';
import AddDefectModal from './AddDefectModal';
import { getDefectData, updateDefectData, deleteDefectData } from '../services/defectRateService';

const DefectRateGreenSection = ({ projectNumber }) => {
    const [defectData, setDefectData] = useState([]);
    const [editingData, setEditingData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDefectData(projectNumber);
                setDefectData(data);
                setEditingData(data);
            } catch (error) {
                console.error('Error fetching defect data:', error);
            }
        };

        fetchData();
    }, [projectNumber]);

    const handleInputChange = (e, id, field) => {
        const newData = editingData.map((row) =>
            row.id === id ? { ...row, [field]: e.target.value } : row
        );
        setEditingData(newData);
    };

    const handleUpdate = async (id) => {
        const updatedRow = editingData.find(row => row.id === id);
        await updateDefectData(id, updatedRow);
    };

    const handleDelete = async (id) => {
        await deleteDefectData(id);
        setDefectData(defectData.filter(row => row.id !== id));
        setEditingData(editingData.filter(row => row.id !== id));
    };

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalAdd = async () => {
        setIsModalOpen(false);
        const data = await getDefectData(projectNumber);
        setDefectData(data);
        setEditingData(data);
    };

    return (
        <div className="defect-rate-green-section">
            <h4 className="chart-title">선박별 불량 용접 데이터</h4>
            <button onClick={handleAdd} className="styled-button">Add New Data</button>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vessel Type Long</th>
                            <th>Department Code</th>
                            <th>Company Type</th>
                            <th>Reason Details</th>
                            <th>Welding Method</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editingData.map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.vessel_type_long}
                                        onChange={(e) => handleInputChange(e, row.id, 'vessel_type_long')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.department_code}
                                        onChange={(e) => handleInputChange(e, row.id, 'department_code')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.company_type}
                                        onChange={(e) => handleInputChange(e, row.id, 'company_type')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.reason_details}
                                        onChange={(e) => handleInputChange(e, row.id, 'reason_details')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.welding_method}
                                        onChange={(e) => handleInputChange(e, row.id, 'welding_method')}
                                    />
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleUpdate(row.id)}>Update</button>
                                        <button onClick={() => handleDelete(row.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <AddDefectModal onClose={handleModalClose} onAdd={handleModalAdd} />}
        </div>
    );
};

export default DefectRateGreenSection;