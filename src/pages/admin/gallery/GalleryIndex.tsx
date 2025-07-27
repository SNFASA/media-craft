import { useState } from "react";
import { Link } from "react-router-dom";
import { useGalleryStore } from "@/stores/galleryStore";
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
  Images,
  Star,
  Calendar
} from "lucide-react";
import { GalleryCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const categoryLabels: Record<GalleryCategory, string> = {
  'events': 'Events',
  'campus': 'Campus',
  'academic': 'Academic',
  'sports': 'Sports',
  'cultural': 'Cultural',
  'graduation': 'Graduation'
};

const sizeColors = {
  small: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  large: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

export default function GalleryIndex() {
  const { gallery, deleteGalleryItem, searchGallery } = useGalleryStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "">("");
  const [showFeatured, setShowFeatured] = useState<boolean | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredGallery = searchGallery(searchQuery, selectedCategory || undefined, showFeatured);
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const currentItems = filteredGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteGalleryItem(id);
      toast({
        title: "Gallery Item Deleted",
        description: `"${title}" has been successfully deleted.`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setShowFeatured(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gallery Management</h2>
          <p className="text-muted-foreground">
            Manage university photos, event galleries, and visual content.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary">
          <Link to="/admin/gallery/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Gallery Item
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
                placeholder="Search gallery items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value as GalleryCategory)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={showFeatured?.toString() || "all"} onValueChange={(value) => setShowFeatured(value === "all" ? undefined : value === "true")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="true">Featured</SelectItem>
                  <SelectItem value="false">Not Featured</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || selectedCategory || showFeatured !== undefined) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {currentItems.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Images className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No gallery items found</h3>
            <p className="text-muted-foreground mb-4">
              {filteredGallery.length === 0 && gallery.length > 0
                ? "Try adjusting your search criteria."
                : "Get started by adding your first gallery item."}
            </p>
            {filteredGallery.length === 0 && gallery.length === 0 && (
              <Button asChild>
                <Link to="/admin/gallery/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gallery Item
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((item) => (
            <Card key={item.id} className="shadow-soft hover:shadow-elevated transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={item.mainImage}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {item.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/gallery/${item.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/gallery/${item.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.id, item.title)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {categoryLabels[item.category]}
                  </Badge>
                  <Badge className={sizeColors[item.size]}>
                    {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(item.date, 'MMM dd, yyyy')}</span>
                  </div>
                  {item.additionalImages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Images className="h-4 w-4 text-muted-foreground" />
                      <span>{item.additionalImages.length + 1} images</span>
                    </div>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3} more
                        </Badge>
                      )}
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