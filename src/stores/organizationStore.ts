import { ExcoSection, ExcoMember } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const mockDeanOrg: ExcoSection[] = [
  {
    id: '1',
    category: 'Executive',
    organizationType: 'dean',
    head: {
      id: '1-head',
      name: 'Dr. Michael Anderson',
      position: 'Dean',
      image: 'https://images.unsplash.com/photo-1472399961693-142e6e269027?w=400',
      category: 'Executive',
      isHead: true,
      order: 1,
    },
    members: [
      {
        id: '1-1',
        name: 'Dr. Sarah Johnson',
        position: 'Associate Dean',
        image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400',
        category: 'Executive',
        isHead: false,
        order: 2,
      },
      {
        id: '1-2',
        name: 'Prof. David Chen',
        position: 'Assistant Dean',
        category: 'Executive',
        isHead: false,
        order: 3,
      },
    ],
  },
  {
    id: '2',
    category: 'Academic Affairs',
    organizationType: 'dean',
    head: {
      id: '2-head',
      name: 'Dr. Emily Rodriguez',
      position: 'Director of Academic Affairs',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400',
      category: 'Academic Affairs',
      isHead: true,
      order: 1,
    },
    members: [
      {
        id: '2-1',
        name: 'Prof. James Wilson',
        position: 'Academic Coordinator',
        category: 'Academic Affairs',
        isHead: false,
        order: 2,
      },
    ],
  },
];

const mockItcOrg: ExcoSection[] = [
  {
    id: '3',
    category: 'Information Technology',
    organizationType: 'itc',
    head: {
      id: '3-head',
      name: 'Alex Thompson',
      position: 'IT Director',
      image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400',
      category: 'Information Technology',
      isHead: true,
      order: 1,
    },
    members: [
      {
        id: '3-1',
        name: 'Maria Garcia',
        position: 'Systems Administrator',
        category: 'Information Technology',
        isHead: false,
        order: 2,
      },
      {
        id: '3-2',
        name: 'John Kim',
        position: 'Network Specialist',
        category: 'Information Technology',
        isHead: false,
        order: 3,
      },
    ],
  },
  {
    id: '4',
    category: 'Technical Support',
    organizationType: 'itc',
    head: {
      id: '4-head',
      name: 'Lisa Wang',
      position: 'Support Manager',
      image: 'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?w=400',
      category: 'Technical Support',
      isHead: true,
      order: 1,
    },
    members: [
      {
        id: '4-1',
        name: 'Robert Brown',
        position: 'Help Desk Technician',
        category: 'Technical Support',
        isHead: false,
        order: 2,
      },
    ],
  },
];

export function useOrganizationStore() {
  const [deanOrg, setDeanOrg] = useState<ExcoSection[]>([]);
  const [itcOrg, setItcOrg] = useState<ExcoSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('excosection')
        .select('*');

      if (sectionsError) throw sectionsError;

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('excomember')
        .select('*')
        .order('order', { ascending: true });

      if (membersError) throw membersError;

      // Group members by category and organization type
      const membersByCategory: Record<string, ExcoMember[]> = {};
      const headsByCategory: Record<string, ExcoMember> = {};

      membersData.forEach(member => {
        const key = `${member.category}`;
        const memberObj: ExcoMember = {
          id: member.id,
          name: member.name,
          position: member.position,
          image: member.image || undefined,
          category: member.category,
          isHead: member.is_head || false,
          order: member.order,
        };

        if (member.is_head) {
          headsByCategory[key] = memberObj;
        } else {
          if (!membersByCategory[key]) membersByCategory[key] = [];
          membersByCategory[key].push(memberObj);
        }
      });

      // Build sections with members
      const formattedSections: ExcoSection[] = sectionsData.map(section => ({
        id: section.id,
        category: section.category,
        organizationType: section.organization_type as 'dean' | 'itc',
        head: headsByCategory[section.category],
        members: membersByCategory[section.category] || [],
      }));

      // Separate by organization type
      const deanSections = formattedSections.filter(s => s.organizationType === 'dean');
      const itcSections = formattedSections.filter(s => s.organizationType === 'itc');

      setDeanOrg(deanSections);
      setItcOrg(itcSections);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Set empty organizations on error
      setDeanOrg([]);
      setItcOrg([]);
    } finally {
      setLoading(false);
    }
  };

  const getOrganization = (type: 'dean' | 'itc') => {
    return type === 'dean' ? deanOrg : itcOrg;
  };

  const setOrganization = (type: 'dean' | 'itc', sections: ExcoSection[]) => {
    if (type === 'dean') {
      setDeanOrg(sections);
    } else {
      setItcOrg(sections);
    }
  };

  const addSection = async (type: 'dean' | 'itc', sectionData: Omit<ExcoSection, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('excosection')
        .insert([{
          category: sectionData.category,
          organization_type: type,
          head: sectionData.head?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const newSection: ExcoSection = {
        id: data.id,
        category: data.category,
        organizationType: type,
        head: sectionData.head,
        members: sectionData.members || [],
      };
      
      const current = getOrganization(type);
      setOrganization(type, [...current, newSection]);
      return newSection;
    } catch (error) {
      console.error('Error adding section:', error);
      throw error;
    }
  };

  const updateSection = async (type: 'dean' | 'itc', id: string, updates: Partial<ExcoSection>) => {
    try {
      const updateData: any = {};
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.head !== undefined) updateData.head = updates.head?.id;

      const { error } = await supabase
        .from('excosection')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      const current = getOrganization(type);
      const updated = current.map(section => 
        section.id === id ? { ...section, ...updates } : section
      );
      setOrganization(type, updated);
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  };

  const deleteSection = async (type: 'dean' | 'itc', id: string) => {
    try {
      const { error } = await supabase
        .from('excosection')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const current = getOrganization(type);
      const filtered = current.filter(section => section.id !== id);
      setOrganization(type, filtered);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  };

  const addMember = async (type: 'dean' | 'itc', sectionId: string, memberData: Omit<ExcoMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('excomember')
        .insert([{
          name: memberData.name,
          position: memberData.position,
          image: memberData.image,
          category: memberData.category,
          is_head: memberData.isHead,
          order: memberData.order,
        }])
        .select()
        .single();

      if (error) throw error;

      const newMember: ExcoMember = {
        id: data.id,
        name: data.name,
        position: data.position,
        image: data.image || undefined,
        category: data.category,
        isHead: data.is_head || false,
        order: data.order,
      };

      const current = getOrganization(type);
      const updated = current.map(section => {
        if (section.id === sectionId) {
          if (memberData.isHead) {
            return { ...section, head: newMember };
          } else {
            return { ...section, members: [...section.members, newMember] };
          }
        }
        return section;
      });
      
      setOrganization(type, updated);
      return newMember;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  };

  const updateMember = async (type: 'dean' | 'itc', sectionId: string, memberId: string, updates: Partial<ExcoMember>) => {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.position !== undefined) updateData.position = updates.position;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.isHead !== undefined) updateData.is_head = updates.isHead;
      if (updates.order !== undefined) updateData.order = updates.order;

      const { error } = await supabase
        .from('excomember')
        .update(updateData)
        .eq('id', memberId);

      if (error) throw error;

      const current = getOrganization(type);
      const updated = current.map(section => {
        if (section.id === sectionId) {
          if (section.head?.id === memberId) {
            return { ...section, head: { ...section.head, ...updates } };
          } else {
            return {
              ...section,
              members: section.members.map(member => 
                member.id === memberId ? { ...member, ...updates } : member
              )
            };
          }
        }
        return section;
      });
      
      setOrganization(type, updated);
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  };

  const deleteMember = async (type: 'dean' | 'itc', sectionId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from('excomember')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      const current = getOrganization(type);
      const updated = current.map(section => {
        if (section.id === sectionId) {
          if (section.head?.id === memberId) {
            return { ...section, head: undefined };
          } else {
            return {
              ...section,
              members: section.members.filter(member => member.id !== memberId)
            };
          }
        }
        return section;
      });
      
      setOrganization(type, updated);
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  };

  return {
    deanOrg,
    itcOrg,
    loading,
    getOrganization,
    addSection,
    updateSection,
    deleteSection,
    addMember,
    updateMember,
    deleteMember,
    fetchOrganizations,
  };
}