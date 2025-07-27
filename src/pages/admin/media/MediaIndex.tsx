import { useState } from "react";
import { useMediaStore } from "@/stores/mediaStore";
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
  Upload, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Download,
  FileText,
  Image,
  Video,
  FolderOpen
} from "lucide-react";
import { MediaFile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const typeIcons = {
  image: Image,
  document: FileText,
  video: Video
};

const typeColors = {
  image: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  document: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

export default function MediaIndex() {
  const { media, deleteMediaFile, addMediaFile, searchMedia, formatFileSize } = useMediaStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<MediaFile['type'] | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const itemsPerPage = 12;

  const filteredMedia = searchMedia(searchQuery, selectedType || undefined);
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const currentFiles = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        // Determine file type
        let type: MediaFile['type'] = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';

        // Create a data URL for preview (for images) or use filename
        const url = type === 'image' ? URL.createObjectURL(file) : `/uploads/${file.name}`;

        const fileData = {
          filename: file.name.replace(/[^a-zA-Z0-9.-]/g, '_'),
          originalName: file.name,
          url,
          type,
          size: file.size
        };

        addMediaFile(fileData);
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleDelete = (id: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      deleteMediaFile(id);
      toast({
        title: "File Deleted",
        description: `"${filename}" has been successfully deleted.`,
      });
    }
  };

  const handleDownload = (file: MediaFile) => {
    // For demo purposes, just show a toast
    toast({
      title: "Download Started",
      description: `Downloading "${file.originalName}"...`
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setCurrentPage(1);
  };

  const renderFilePreview = (file: MediaFile) => {
    const IconComponent = typeIcons[file.type];
    
    if (file.type === 'image') {
      return (
        <img
          src={file.url}
          alt={file.originalName}
          className="w-full h-32 object-cover"
        />
      );
    }

    return (
      <div className="w-full h-32 flex items-center justify-center bg-muted">
        <IconComponent className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Media Manager</h2>
          <p className="text-muted-foreground">
            Upload and manage files, images, documents, and videos.
          </p>
        </div>
        <div>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <Button asChild className="bg-gradient-primary" disabled={isUploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </label>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedType || "all"} onValueChange={(value) => setSelectedType(value === "all" ? "" : value as MediaFile['type'])}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || selectedType) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {currentFiles.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">
              {filteredMedia.length === 0 && media.length > 0
                ? "Try adjusting your search criteria."
                : "Get started by uploading your first file."}
            </p>
            {filteredMedia.length === 0 && media.length === 0 && (
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </label>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentFiles.map((file) => (
            <Card key={file.id} className="shadow-soft hover:shadow-elevated transition-shadow overflow-hidden">
              <div className="relative">
                {renderFilePreview(file)}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(file.id, file.originalName)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge className={typeColors[file.type]}>
                    {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-sm line-clamp-2" title={file.originalName}>
                  {file.originalName}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{formatFileSize(file.size)}</p>
                  <p>{format(file.createdAt, 'MMM dd, yyyy')}</p>
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