import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventEligibility } from '@/types';

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

      const formattedEvents: Event[] = data.map((event: any): Event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        image: event.image || undefined,
        date: new Date(event.date),
        time: event.time,
        location: event.location,
        eligibility: event.eligibility as EventEligibility,
        registrationRequired: event.registration_required ?? false,
        status: event.status,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at),
        details: {
          agenda: event.details?.agenda ?? undefined,
          isFree: event.details?.isFree ?? undefined,
          hasCertificate: event.details?.hasCertificate ?? undefined,
          hasRefreshments: event.details?.hasRefreshments ?? undefined,
          hasTrasportation: event.details?.hasTrasportation ?? undefined,
          isOnline: event.details?.isOnline ?? undefined,
          isLimited: event.details?.isLimited ?? undefined,
        },
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
          date: eventData.date.toISOString(),
          time: eventData.time,
          location: eventData.location,
          eligibility: eventData.eligibility,
          registration_required: eventData.registrationRequired,
          status: eventData.status,
          details: {
            agenda: eventData.details?.agenda,
            isFree: eventData.details?.isFree,
            hasCertificate: eventData.details?.hasCertificate,
            hasRefreshments: eventData.details?.hasRefreshments,
            hasTrasportation: eventData.details?.hasTrasportation,
            isOnline: eventData.details?.isOnline,
            isLimited: eventData.details?.isLimited,
          },
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
        registrationRequired: data.registration_required,
        status: data.status,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        details: {
          agenda: data.details?.agenda ?? undefined,
          isFree: data.details?.isFree ?? undefined,
          hasCertificate: data.details?.hasCertificate ?? undefined,
          hasRefreshments: data.details?.hasRefreshments ?? undefined,
          hasTrasportation: data.details?.hasTrasportation ?? undefined,
          isOnline: data.details?.isOnline ?? undefined,
          isLimited: data.details?.isLimited ?? undefined,
        },
      };

      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Omit<Event, 'createdAt' | 'updatedAt'>>) => {
    try {
      const updateData: Record<string, any> = {};

      const addIfDefined = <T>(key: string, value: T | undefined) => {
        if (value !== undefined) updateData[key] = value;
      };

      addIfDefined('title', updates.title);
      addIfDefined('description', updates.description);
      addIfDefined('image', updates.image);
      addIfDefined('date', updates.date?.toISOString());
      addIfDefined('time', updates.time);
      addIfDefined('location', updates.location);
      addIfDefined('eligibility', updates.eligibility);
      addIfDefined('registration_required', updates.registrationRequired);
      addIfDefined('status', updates.status);
      if (updates.details !== undefined) addIfDefined('details', updates.details);

      const { error } = await supabase
        .from('event')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEvents(prev =>
        prev.map(event =>
          event.id === id ? { ...event, ...updates, updatedAt: new Date() } : event
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

  const searchEvents = (query: string, eligibility?: EventEligibility) => {
    return events.filter(event => {
      const matchesQuery =
        !query ||
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase());

      const matchesEligibility = !eligibility || event.eligibility === eligibility;

      return matchesQuery && matchesEligibility;
    });
  };

  return {
    events,
    loading,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    searchEvents,
  };
}
