import { ExcoSection, ExcoMember } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [deanOrg, setDeanOrg] = useLocalStorage<ExcoSection[]>('admin_dean_org', mockDeanOrg);
  const [itcOrg, setItcOrg] = useLocalStorage<ExcoSection[]>('admin_itc_org', mockItcOrg);

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

  const addSection = (type: 'dean' | 'itc', sectionData: Omit<ExcoSection, 'id'>) => {
    const newSection: ExcoSection = {
      id: Date.now().toString(),
      ...sectionData,
      organizationType: type,
    };
    
    const current = getOrganization(type);
    setOrganization(type, [...current, newSection]);
    return newSection;
  };

  const updateSection = (type: 'dean' | 'itc', id: string, updates: Partial<ExcoSection>) => {
    const current = getOrganization(type);
    const updated = current.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    setOrganization(type, updated);
  };

  const deleteSection = (type: 'dean' | 'itc', id: string) => {
    const current = getOrganization(type);
    const filtered = current.filter(section => section.id !== id);
    setOrganization(type, filtered);
  };

  const addMember = (type: 'dean' | 'itc', sectionId: string, memberData: Omit<ExcoMember, 'id'>) => {
    const newMember: ExcoMember = {
      id: `${sectionId}-${Date.now()}`,
      ...memberData,
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
  };

  const updateMember = (type: 'dean' | 'itc', sectionId: string, memberId: string, updates: Partial<ExcoMember>) => {
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
  };

  const deleteMember = (type: 'dean' | 'itc', sectionId: string, memberId: string) => {
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
  };

  return {
    deanOrg,
    itcOrg,
    getOrganization,
    addSection,
    updateSection,
    deleteSection,
    addMember,
    updateMember,
    deleteMember,
  };
}