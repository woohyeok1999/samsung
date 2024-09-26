import React, { useState } from 'react';
import { addDefectData } from '../services/defectRateService';

const AddDefectModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        project_number: '',
        vessel_type_long: '',
        vessel_type_short: '',
        company_type: '',
        inspection_length: '',
        defect_length: '',
        inspection_method: '',
        inspection_id: '',
        department_code: '',
        inspection_record_date: '',
        nde_code: '',
        usage_decision: '',
        reason_code: '',
        reason_details: '',
        manager_number: '',
        manager_name: '',
        manager_code: '',
        welder_number: '',
        welder_name: '',
        welding_completed_date: '',
        welding_method: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            await addDefectData(formData);
            onAdd();
            onClose();
        } catch (error) {
            console.error('Error adding defect data:', error);
        }
    };

    return (
        <div className="green-modal">
            <div className="green-modal-content">
                <h2>불량 데이터 추가</h2>
                <form>
                    <input name="project_number" value={formData.project_number} onChange={handleInputChange} placeholder="Project Number" />
                    <input name="vessel_type_long" value={formData.vessel_type_long} onChange={handleInputChange} placeholder="Vessel Type Long" />
                    <input name="vessel_type_short" value={formData.vessel_type_short} onChange={handleInputChange} placeholder="Vessel Type Short" />
                    <input name="company_type" value={formData.company_type} onChange={handleInputChange} placeholder="Company Type" />
                    <input name="inspection_length" type="number" value={formData.inspection_length} onChange={handleInputChange} placeholder="Inspection Length" />
                    <input name="defect_length" type="number" value={formData.defect_length} onChange={handleInputChange} placeholder="Defect Length" />
                    <input name="inspection_method" value={formData.inspection_method} onChange={handleInputChange} placeholder="Inspection Method" />
                    <input name="inspection_id" value={formData.inspection_id} onChange={handleInputChange} placeholder="Inspection ID" />
                    <input name="department_code" value={formData.department_code} onChange={handleInputChange} placeholder="Department Code" />
                    <input name="inspection_record_date" type="date" value={formData.inspection_record_date} onChange={handleInputChange} placeholder="Inspection Record Date" />
                    <input name="nde_code" value={formData.nde_code} onChange={handleInputChange} placeholder="NDE Code" />
                    <input name="usage_decision" value={formData.usage_decision} onChange={handleInputChange} placeholder="Usage Decision" />
                    <input name="reason_code" value={formData.reason_code} onChange={handleInputChange} placeholder="Reason Code" />
                    <input name="reason_details" value={formData.reason_details} onChange={handleInputChange} placeholder="Reason Details" />
                    <input name="manager_number" value={formData.manager_number} onChange={handleInputChange} placeholder="Manager Number" />
                    <input name="manager_name" value={formData.manager_name} onChange={handleInputChange} placeholder="Manager Name" />
                    <input name="manager_code" value={formData.manager_code} onChange={handleInputChange} placeholder="Manager Code" />
                    <input name="welder_number" value={formData.welder_number} onChange={handleInputChange} placeholder="Welder Number" />
                    <input name="welder_name" value={formData.welder_name} onChange={handleInputChange} placeholder="Welder Name" />
                    <input name="welding_completed_date" type="date" value={formData.welding_completed_date} onChange={handleInputChange} placeholder="Welding Completed Date" />
                    <textarea name="welding_method" value={formData.welding_method} onChange={handleInputChange} placeholder="Welding Method"></textarea>
                </form>
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Add</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddDefectModal;