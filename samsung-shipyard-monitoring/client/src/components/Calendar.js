import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import EventModal from './EventModal';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('https://localhost:5000/api/calendar');
            setEvents(response.data.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            })));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedEvent({ start, end: moment(start).add(1, 'hour').toDate(), title: '', description: '', eventTime: moment(start).format('HH:mm') });
        setModalMode('add');
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalMode('edit');
        setShowModal(true);
    };

    const addEvent = async (newEvent) => {
        try {
            await axios.post('https://localhost:5000/api/calendar', newEvent);
            fetchEvents();
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const updateEvent = async (updatedEvent) => {
        try {
            await axios.put(`https://localhost:5000/api/calendar/${updatedEvent.id}`, updatedEvent);
            fetchEvents();
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`https://localhost:5000/api/calendar/${eventId}`);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const now = new Date();
        const isPast = end < now;
        const style = {
            backgroundColor: isPast ? '#adb5bd' : '#4dabf7',
            borderRadius: '3px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block'
        };
        return { style };
    };

    const customEventWrapper = ({ event, children }) => {
        const startTime = moment(event.start).format('HH:mm');
        const endTime = moment(event.end).format('HH:mm');
        const tooltipContent = `${startTime} - ${endTime} ; ${event.title}`;

        return (
            <div title={tooltipContent}>
                {children}
            </div>
        );
    };

    const customEventContents = ({ event }) => {
        const content = event.title.length > 15 ? event.title.slice(0, 15) + '...' : event.title;
        return <span>{content}</span>;
    };

    return (
        <div className="calendar">
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor={(event) => {
                    const [hours, minutes] = event.eventTime.split(':');
                    const eventDate = new Date(event.start);
                    eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                    return eventDate;
                }}
                endAccessor={(event) => {
                    const [hours, minutes] = event.eventTime.split(':');
                    const eventDate = new Date(event.end);
                    eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
                    return moment(eventDate).add(1, 'hour').toDate();
                }}
                style={{ height: 'calc(100% - 20px)' }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                formats={{
                    timeGutterFormat: (date, culture, localizer) =>
                        localizer.format(date, 'HH:mm', culture),
                    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                        localizer.format(start, 'HH:mm', culture),
                    agendaDateFormat: (date, culture, localizer) =>
                        localizer.format(date, 'ddd MMM D', culture)
                }}
                views={['month', 'week', 'day', 'agenda']}
                step={30}
                timeslots={2}
                components={{
                    eventWrapper: customEventWrapper,
                    event: customEventContents
                }}
            />
            {showModal && (
                <EventModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={modalMode === 'add' ? addEvent : updateEvent}
                    onDelete={deleteEvent}
                    selectedEvent={selectedEvent}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default Calendar;