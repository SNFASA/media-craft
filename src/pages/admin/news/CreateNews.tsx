import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNewsStore } from "@/stores/newsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react";
import { NewsCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

const categoryLabels: Record<NewsCategory, string> = {
  general: "General",
  academic: "Academic", 
  research: "Research",
  events: "Events",
  announcements: "Announcements",
  "student-life": "Student Life"
};

export default function CreateNews() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNews, updateNews, getNews } = useNewsStore();
  const { toast } = useToast();
  
  const isEditing = Boolean(id);
  const existingNews = isEditing ? getNews(id!) : null;
  
  const [formData, setFormData] = useState({
    title: existingNews?.title || "",
    description: existingNews?.description || "",
    content: existingNews?.content || "",
    category: existingNews?.category || "" as NewsCategory | "",
    status: existingNews?.status || "draft" as "draft" | "published",
    author: existingNews?.author || ""
  });
  const [imagePreview, setImagePreview] = useState<string>(existingNews?.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
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

  const handleSubmit = async (status: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for the article.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error", 
        description: "Please select a category.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.author.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an author name.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const articleData = {
        ...formData,
        category: formData.category as NewsCategory,
        status,
        image: imagePreview,
        publishedAt: status === "published" ? new Date() : undefined
      };

      if (isEditing) {
        await updateNews(id!, articleData);
      } else {
        await addNews(articleData);
      }

      toast({
        title: "Success!",
        description: `Article ${status === "published" ? "published" : "saved as draft"} successfully.`
      });

      navigate("/admin/news");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
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
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/news")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit News Article' : 'Create News Article'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update article details' : 'Create and publish a new article for your university portal.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter article title..."
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the article..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter author name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your article content here..."
                  rows={12}
                  className="min-h-[300px]"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: You can use HTML tags for rich formatting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Options */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Publish Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={() => handleSubmit("draft")}
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSubmit("published")}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-primary"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
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
                    Upload a featured image for your article
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