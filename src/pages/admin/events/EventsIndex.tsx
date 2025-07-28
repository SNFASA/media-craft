import { useState } from "react";
import { Link } from "react-router-dom";
import { useEventStore } from "@/stores/eventStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Users,
  Clock
} from "lucide-react";
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

const statusColors: Record<Event['status'], string> = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export default function EventsIndex() {
  const { events, deleteEvent, searchEvents } = useEventStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEligibility, setSelectedEligibility] = useState<EventEligibility | "">("");
  const [selectedStatus, setSelectedStatus] = useState<Event['status'] | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredEvents = searchEvents(searchQuery, selectedEligibility || undefined, selectedStatus || undefined);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteEvent(id);
      toast({
        title: "Event Deleted",
        description: `"${title}" has been successfully deleted.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedEligibility("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Events Management</h2>
          <p className="text-muted-foreground">
            Manage university events, workshops, and activities.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary">
          <Link to="/admin/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedEligibility || "all"} onValueChange={(value) => setSelectedEligibility(value === "all" ? "" : value as EventEligibility)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Eligibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Eligibility</SelectItem>
                  {Object.entries(eligibilityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus || "all"} onValueChange={(value) => setSelectedStatus(value === "all" ? "" : value as Event['status'])}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || selectedEligibility || selectedStatus) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {currentEvents.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {filteredEvents.length === 0 && events.length > 0
                ? "Try adjusting your search criteria."
                : "Get started by creating your first event."}
            </p>
            {filteredEvents.length === 0 && events.length === 0 && (
              <Button asChild>
                <Link to="/admin/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentEvents.map((event) => (
            <Card key={event.id} className="shadow-soft hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                    <Badge className={statusColors[event.status]}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/events/${event.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(event.id, event.title)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(event.date, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{eligibilityLabels[event.eligibility]}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Capacity: {event.capacity}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}