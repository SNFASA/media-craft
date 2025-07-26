import { useNavigate, useParams } from "react-router-dom";
import { useEventStore } from "@/stores/eventStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { EventEligibility, Event } from "@/types";
import { format } from "date-fns";

const eligibilityLabels: Record<EventEligibility, string> = {
  'all-students': 'All Students',
  'undergraduates': 'Undergraduates',
  'graduates': 'Graduates',
  'faculty': 'Faculty',
  'staff': 'Staff',
  'public': 'Public'
};

const statusColors: Record<Event['status'], string> = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export default function ViewEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getEvent } = useEventStore();
  
  const event = id ? getEvent(id) : null;

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Event not found</h3>
            <p className="text-muted-foreground">
              The event you're looking for doesn't exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">{event.title}</h2>
            <p className="text-muted-foreground">
              Created on {format(event.createdAt, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <Button asChild>
          <a href={`/admin/events/${event.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          {event.image && (
            <Card className="shadow-soft overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Event Details */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>Event Details</CardTitle>
                <Badge className={statusColors[event.status]}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(event.date, 'EEEE, MMMM dd, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">Date</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.time}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{eligibilityLabels[event.eligibility]}</p>
                  <p className="text-sm text-muted-foreground">Eligibility</p>
                </div>
              </div>

              {event.capacity && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.capacity}</p>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                  </div>
                </div>
              )}

              {event.registrationRequired && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Required</p>
                    <p className="text-sm text-muted-foreground">Registration</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(event.createdAt, 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{format(event.updatedAt, 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Event ID</p>
                <p className="font-mono text-sm">{event.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}