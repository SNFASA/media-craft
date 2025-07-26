import { Event, EventEligibility } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Science Fair',
    description: 'Showcase of innovative student research projects and scientific discoveries.',
    image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=800',
    date: new Date('2024-03-15'),
    time: '10:00 AM',
    location: 'Main Auditorium',
    eligibility: 'all-students',
    registrationRequired: true,
    capacity: 500,
    status: 'upcoming',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Career Development Workshop',
    description: 'Professional development session focusing on resume building and interview skills.',
    date: new Date('2024-02-28'),
    time: '2:00 PM',
    location: 'Conference Room A',
    eligibility: 'undergraduates',
    registrationRequired: true,
    capacity: 50,
    status: 'upcoming',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Faculty Research Symposium',
    description: 'Annual presentation of ongoing research projects by faculty members.',
    date: new Date('2024-04-10'),
    time: '9:00 AM',
    location: 'Research Building Hall',
    eligibility: 'faculty',
    registrationRequired: false,
    status: 'upcoming',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export function useEventStore() {
  const [events, setEvents] = useLocalStorage<Event[]>('admin_events', mockEvents);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...eventData,
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const searchEvents = (query: string, eligibility?: EventEligibility, status?: Event['status']) => {
    return events.filter(event => {
      const matchesQuery = query === '' || 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase());
      
      const matchesEligibility = !eligibility || event.eligibility === eligibility;
      const matchesStatus = !status || event.status === status;
      
      return matchesQuery && matchesEligibility && matchesStatus;
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    searchEvents,
  };
}