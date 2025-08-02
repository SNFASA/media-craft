import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "@/stores/eventStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Calendar, Upload, X } from "lucide-react";
import { EventEligibility, Event } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const eligibilityLabels: Record<EventEligibility, string> = {
  'all-students': 'All Students',
  'undergraduates': 'Undergraduates',
  'graduates': 'Graduates',
  'faculty': 'Faculty',
  'staff': 'Staff',
  'public': 'Public'
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addEvent, updateEvent, getEvent } = useEventStore();
  const { toast } = useToast();
  
  const isEditing = Boolean(id);
  const existingEvent = isEditing ? getEvent(id) : null;
  
  const [formData, setFormData] = useState({
    title: existingEvent?.title || "",
    description: existingEvent?.description || "",
    date: existingEvent ? format(existingEvent.date, 'yyyy-MM-dd') : "",
    time: existingEvent?.time || "",
    location: existingEvent?.location || "",
    eligibility: existingEvent?.eligibility || "" as EventEligibility | "",
    registrationRequired: existingEvent?.registrationRequired || false,
    capacity: existingEvent?.capacity?.toString() || "",
    status: existingEvent?.status || "upcoming" as Event['status']
  });
  const [imagePreview, setImagePreview] = useState<string>(existingEvent?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const removeImage = () => {
    setImagePreview("");
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Validation Error",
        description: "Please select an event date.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.eligibility) {
      toast({
        title: "Validation Error", 
        description: "Please select eligibility criteria.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const Event = {
        ...formData,
        date: new Date(formData.date),
        eligibility: formData.eligibility as EventEligibility,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        image: imagePreview || undefined
      };

      if (isEditing) {
        await updateEvent(id!, Event);
        toast({
          title: "Success!",
          description: "Event updated successfully."
        });
      } else {
        await addEvent(Event);
        toast({
          title: "Success!",
          description: "Event created successfully."
        });
      }

      navigate("/admin/events");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Event' : 'Create Event'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update event details' : 'Create a new club event or activity.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title..."
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the event..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    placeholder="e.g., 10:00 AM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Event location..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eligibility">Eligibility *</Label>
                <Select value={formData.eligibility} onValueChange={(value) => handleInputChange("eligibility", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eligibilityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="registration"
                  checked={formData.registrationRequired}
                  onCheckedChange={(checked) => handleInputChange("registrationRequired", checked as boolean)}
                />
                <Label htmlFor="registration">Registration Required</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  placeholder="Maximum attendees..."
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Event Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    onClick={removeImage}
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload an image for the event
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild variant="outline" size="sm">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Choose Image
                    </label>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}