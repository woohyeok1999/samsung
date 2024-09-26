import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ show, onClose, onSave, onDelete, selectedEvent, mode }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventTime, setEventTime] = useState('00:00');

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title || '');
            setDescription(selectedEvent.description || '');
            setEventTime(selectedEvent.eventTime || '00:00');
        }
    }, [selectedEvent]);

    const handleSave = () => {
        const updatedEvent = {
            ...selectedEvent,
            title,
            description,
            eventTime
        };
        onSave(updatedEvent);
        onClose();
    };

    const handleDelete = () => {
        onDelete(selectedEvent.id);
        onClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{mode === 'add' ? '일정 추가' : '일정 변경'}</h2>
                <input
                    type="text"
                    placeholder="일정명"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="일정 내용"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                >
                    {Array.from({ length: 48 }, (_, i) => {
                        const hours = Math.floor(i / 2);
                        const minutes = i % 2 === 0 ? '00' : '30';
                        return `${hours.toString().padStart(2, '0')}:${minutes}`;
                    }).map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
                <div className="modal-buttons">
                    <button onClick={handleSave} className="save-btn">
                        {mode === 'add' ? 'Add' : 'Update'}
                    </button>
                    {mode === 'edit' && (
                        <button onClick={handleDelete} className="delete-btn">Delete</button>
                    )}
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
