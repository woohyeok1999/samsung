const fs = require('fs').promises;
const path = require('path');

const CALENDAR_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'calendar_events.json');

exports.getEvents = async (req, res) => {
    try {
        const data = await fs.readFile(CALENDAR_DATA_PATH, 'utf8');
        const events = JSON.parse(data);
        res.json(events);
    } catch (error) {
        console.error('Error reading calendar events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addEvent = async (req, res) => {
    try {
        const { title, description, start, end, eventTime } = req.body;
        const data = await fs.readFile(CALENDAR_DATA_PATH, 'utf8');
        const events = JSON.parse(data);
        
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);

        const newEvent = { 
            id: Date.now(), 
            title, 
            description, 
            start: startDateTime, 
            end: endDateTime, 
            eventTime 
        };
        events.push(newEvent);
        await fs.writeFile(CALENDAR_DATA_PATH, JSON.stringify(events));
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error adding calendar event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readFile(CALENDAR_DATA_PATH, 'utf8');
        let events = JSON.parse(data);
        events = events.filter(event => event.id !== parseInt(id));
        await fs.writeFile(CALENDAR_DATA_PATH, JSON.stringify(events));
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTodayEvents = async (req, res) => {
    try {
      const data = await fs.readFile(CALENDAR_DATA_PATH, 'utf8');
      const events = JSON.parse(data);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === today.getDate() &&
               eventDate.getMonth() === today.getMonth() &&
               eventDate.getFullYear() === today.getFullYear();
      });
  
      todayEvents.sort((a, b) => a.eventTime.localeCompare(b.eventTime));
  
      res.json(todayEvents);
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, start, end, eventTime } = req.body;
        const data = await fs.readFile(CALENDAR_DATA_PATH, 'utf8');
        let events = JSON.parse(data);
        const eventIndex = events.findIndex(event => event.id === parseInt(id));
        if (eventIndex !== -1) {
            const startDateTime = new Date(start);
            const endDateTime = new Date(end);

            events[eventIndex] = { 
                ...events[eventIndex], 
                title, 
                description, 
                start: startDateTime, 
                end: endDateTime, 
                eventTime 
            };
            await fs.writeFile(CALENDAR_DATA_PATH, JSON.stringify(events));
            res.json(events[eventIndex]);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error('Error updating calendar event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};