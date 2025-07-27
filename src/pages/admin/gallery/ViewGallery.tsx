import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useGalleryStore } from '@/stores/galleryStore';
import { GalleryCategory } from '@/types';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Images, 
  Star,
  Tag,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

const categoryLabels: Record<GalleryCategory, string> = {
  'events': 'Events',
  'campus': 'Campus',
  'academic': 'Academic',
  'sports': 'Sports',
  'cultural': 'Cultural',
  'graduation': 'Graduation'
};

const ViewGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getGalleryItem, deleteGalleryItem } = useGalleryStore();
  
  const item = id ? getGalleryItem(id) : null;

  if (!item) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/gallery')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Gallery item not found</h3>
            <p className="text-muted-foreground mb-4">
              The gallery item you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/admin/gallery')}>
              Return to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      deleteGalleryItem(item.id);
      toast({
        title: "Gallery Item Deleted",
        description: `"${item.title}" has been successfully deleted.`,
      });
      navigate('/admin/gallery');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/gallery')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {categoryLabels[item.category]}
              </Badge>
              <Badge variant={item.size === 'large' ? 'default' : 'outline'}>
                {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
              </Badge>
              {item.featured && (
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/admin/gallery/${item.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card>
            <CardContent className="p-0">
              <img
                src={item.mainImage}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </CardContent>
          </Card>

          {/* Description */}
          {item.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Images */}
          {item.additionalImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Images className="h-5 w-5" />
                  Additional Images ({item.additionalImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {item.additionalImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`${item.title} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-medium">{format(item.date, 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Images className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Images</p>
                  <p className="font-medium">{item.additionalImages.length + 1}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Category</p>
                <Badge variant="secondary">
                  {categoryLabels[item.category]}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Size</p>
                <Badge variant={item.size === 'large' ? 'default' : 'outline'}>
                  {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                </Badge>
              </div>

              {item.featured && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured Item
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {item.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {format(item.createdAt, 'MMM dd, yyyy - h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(item.updatedAt, 'MMM dd, yyyy - h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewGallery;