import { Event, EventEligibility } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        image: event.image || undefined,
        date: new Date(event.date),
        time: event.time,
        location: event.location,
        eligibility: event.eligibility as EventEligibility,
        registrationRequired: event.registration_required || false,
        capacity: event.capacity || undefined,
        status: event.status as Event['status'],
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('event')
        .insert([{
          title: eventData.title,
          description: eventData.description,
          image: eventData.image,
          date: eventData.date.toISOString().split('T')[0],
          time: eventData.time,
          location: eventData.location,
          eligibility: eventData.eligibility,
          registration_required: eventData.registrationRequired,
          capacity: eventData.capacity,
          status: eventData.status,
        }])
        .select()
        .single();

      if (error) throw error;

      const newEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image || undefined,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        eligibility: data.eligibility as EventEligibility,
        registrationRequired: data.registration_required || false,
        capacity: data.capacity || undefined,
        status: data.status as Event['status'],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.date !== undefined) updateData.date = updates.date.toISOString().split('T')[0];
      if (updates.time !== undefined) updateData.time = updates.time;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.eligibility !== undefined) updateData.eligibility = updates.eligibility;
      if (updates.registrationRequired !== undefined) updateData.registration_required = updates.registrationRequired;
      if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { error } = await supabase
        .from('event')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => 
        prev.map(event => 
          event.id === id 
            ? { ...event, ...updates, updatedAt: new Date() }
            : event
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
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
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    searchEvents,
    fetchEvents,
  };
}