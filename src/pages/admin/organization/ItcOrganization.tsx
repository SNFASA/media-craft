import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationStore } from '@/stores/organizationStore';
import { ExcoSection, ExcoMember } from '@/types';
import { Plus, Edit, Trash2, Users, UserPlus } from 'lucide-react';

const ItcOrganization = () => {
  const { toast } = useToast();
  const { itcOrg, addSection, updateSection, deleteSection, addMember, updateMember, deleteMember } = useOrganizationStore();
  
  const [editingSection, setEditingSection] = useState<ExcoSection | null>(null);
  const [editingMember, setEditingMember] = useState<{ section: ExcoSection, member: ExcoMember } | null>(null);
  const [newSectionCategory, setNewSectionCategory] = useState('');
  const [memberForm, setMemberForm] = useState({
    name: '',
    position: '',
    image: '',
    isHead: false
  });

  const handleAddSection = () => {
    if (!newSectionCategory.trim()) return;
    
    addSection('itc', {
      category: newSectionCategory,
      members: [],
      organizationType: 'itc'
    });
    
    setNewSectionCategory('');
    toast({
      title: "Section Added",
      description: `${newSectionCategory} section has been created.`,
    });
  };

  const handleDeleteSection = (sectionId: string, sectionName: string) => {
    deleteSection('itc', sectionId);
    toast({
      title: "Section Deleted",
      description: `${sectionName} section has been removed.`,
    });
  };

  const handleAddMember = (section: ExcoSection) => {
    if (!memberForm.name.trim() || !memberForm.position.trim()) return;
    
    addMember('itc', section.id, {
      name: memberForm.name,
      position: memberForm.position,
      image: memberForm.image,
      category: section.category,
      isHead: memberForm.isHead,
      order: memberForm.isHead ? 1 : section.members.length + 2
    });
    
    setMemberForm({ name: '', position: '', image: '', isHead: false });
    toast({
      title: "Member Added",
      description: `${memberForm.name} has been added to ${section.category}.`,
    });
  };

  const handleDeleteMember = (sectionId: string, memberId: string, memberName: string) => {
    deleteMember('itc', sectionId, memberId);
    toast({
      title: "Member Removed",
      description: `${memberName} has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ITC Organization</h1>
          <p className="text-muted-foreground">Manage Information Technology Committee structure</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Section Name</Label>
                <Input
                  id="category"
                  value={newSectionCategory}
                  onChange={(e) => setNewSectionCategory(e.target.value)}
                  placeholder="e.g., Information Technology, Technical Support"
                />
              </div>
              <Button onClick={handleAddSection} className="w-full">
                Create Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {itcOrg.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <div>
                    <CardTitle>{section.category}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {(section.head ? 1 : 0) + section.members.length} members
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Member to {section.category}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={memberForm.name}
                            onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter member name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            value={memberForm.position}
                            onChange={(e) => setMemberForm(prev => ({ ...prev, position: e.target.value }))}
                            placeholder="e.g., IT Director, System Administrator"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">Profile Image URL (optional)</Label>
                          <Input
                            id="image"
                            value={memberForm.image}
                            onChange={(e) => setMemberForm(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isHead"
                            checked={memberForm.isHead}
                            onChange={(e) => setMemberForm(prev => ({ ...prev, isHead: e.target.checked }))}
                            className="rounded border border-input"
                          />
                          <Label htmlFor="isHead">Set as section head</Label>
                        </div>
                        <Button onClick={() => handleAddMember(section)} className="w-full">
                          Add Member
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSection(section.id, section.category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.head && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={section.head.image} />
                          <AvatarFallback>{section.head.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{section.head.name}</h4>
                            <Badge variant="default">Head</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{section.head.position}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(section.id, section.head.id, section.head.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {section.members.length > 0 && (
                  <div className="space-y-2">
                    {section.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.image} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.position}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(section.id, member.id, member.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {!section.head && section.members.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No members in this section yet. Add members to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {itcOrg.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No sections created</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first organizational section.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ItcOrganization;