import { useState } from "react";
import { useOrganizationStore } from "@/stores/organizationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Users, Crown, Upload, X } from "lucide-react";
import { ExcoMember, ExcoSection } from "@/types";
import { useToast } from "@/hooks/use-toast";

const deanCategories = [
  "Executive",
  "Academic Affairs", 
  "Student Affairs",
  "Research",
  "Administration",
  "Finance"
];

export default function DeanOrganization() {
  const { deanOrg, addSection, updateSection, deleteSection, addMember, updateMember, deleteMember } = useOrganizationStore();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<ExcoSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<ExcoMember | null>(null);
  
  const [sectionForm, setSectionForm] = useState({
    category: ""
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    position: "",
    category: "",
    isHead: false,
    order: 1
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForms = () => {
    setSectionForm({ category: "" });
    setMemberForm({ name: "", position: "", category: "", isHead: false, order: 1 });
    setImagePreview("");
    setSelectedSection(null);
    setEditingMember(null);
  };

  const handleAddSection = () => {
    if (!sectionForm.category.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "destructive"
      });
      return;
    }

    addSection('dean', {
      category: sectionForm.category,
      members: [],
      organizationType: 'dean'
    });

    toast({
      title: "Success",
      description: "Section added successfully."
    });

    resetForms();
    setIsDialogOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedSection) return;

    if (!memberForm.name.trim() || !memberForm.position.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingMember) {
      updateMember('dean', selectedSection.id, editingMember.id, {
        ...memberForm,
        image: imagePreview || editingMember.image
      });
      toast({
        title: "Success",
        description: "Member updated successfully."
      });
    } else {
      addMember('dean', selectedSection.id, {
        ...memberForm,
        category: selectedSection.category,
        image: imagePreview || undefined
      });
      toast({
        title: "Success",
        description: "Member added successfully."
      });
    }

    resetForms();
    setIsAddingMember(false);
  };

  const handleDeleteSection = (sectionId: string, category: string) => {
    if (window.confirm(`Are you sure you want to delete the "${category}" section?`)) {
      deleteSection('dean', sectionId);
      toast({
        title: "Section Deleted",
        description: `"${category}" section has been deleted.`
      });
    }
  };

  const handleDeleteMember = (sectionId: string, memberId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      deleteMember('dean', sectionId, memberId);
      toast({
        title: "Member Removed",
        description: `"${name}" has been removed.`
      });
    }
  };

  const startEditMember = (section: ExcoSection, member: ExcoMember) => {
    setSelectedSection(section);
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      position: member.position,
      category: member.category,
      isHead: member.isHead,
      order: member.order
    });
    setImagePreview(member.image || "");
    setIsAddingMember(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dean's Organization</h2>
          <p className="text-muted-foreground">
            Manage the organizational structure of the Dean's office.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={sectionForm.category} onValueChange={(value) => setSectionForm({ category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {deanCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSection} className="flex-1">
                  Add Section
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organization Sections */}
      {deanOrg.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sections found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first organizational section.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {deanOrg.map((section) => (
            <Card key={section.id} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {section.category}
                  <Badge variant="outline">
                    {(section.head ? 1 : 0) + section.members.length} members
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedSection(section);
                      setMemberForm({ ...memberForm, category: section.category });
                      setIsAddingMember(true);
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteSection(section.id, section.category)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Head Member */}
                {section.head && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {section.head.image ? (
                          <img
                            src={section.head.image}
                            alt={section.head.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{section.head.name}</h4>
                            <Crown className="h-4 w-4 text-yellow-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">{section.head.position}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditMember(section, section.head)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMember(section.id, section.head!.id, section.head!.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Members */}
                {section.members.length > 0 && (
                  <div className="grid gap-2">
                    {section.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-medium">{member.name}</h5>
                            <p className="text-sm text-muted-foreground">{member.position}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditMember(section, member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMember(section.id, member.id, member.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!section.head && section.members.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No members in this section yet.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Member Dialog */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={memberForm.position}
                onChange={(e) => setMemberForm({ ...memberForm, position: e.target.value })}
                placeholder="Enter position"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isHead"
                checked={memberForm.isHead}
                onChange={(e) => setMemberForm({ ...memberForm, isHead: e.target.checked })}
              />
              <Label htmlFor="isHead">Set as Head of Section</Label>
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Profile Image</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    onClick={() => setImagePreview("")}
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="member-image-upload"
                  />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="member-image-upload" className="cursor-pointer">
                      Choose Image
                    </label>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddMember} className="flex-1">
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}