import { useState } from "react";
import { Link } from "react-router-dom";
import { useNewsStore } from "@/stores/newsStore";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Calendar,
  User
} from "lucide-react";
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

const statusColors = {
  published: "bg-success text-success-foreground",
  draft: "bg-warning text-warning-foreground"
};

export default function NewsIndex() {
  const { news, deleteNews, searchNews } = useNewsStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");

  const filteredNews = searchNews(
    searchQuery, 
    selectedCategory === "all" ? undefined : selectedCategory
  );

  const handleDelete = (id: string, title: string) => {
    deleteNews(id);
    toast({
      title: "Article deleted",
      description: `"${title}" has been successfully deleted.`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">News Management</h2>
          <p className="text-muted-foreground">
            Manage and publish news articles for your university portal.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary">
          <Link to="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as NewsCategory | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
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
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="grid gap-6">
        {filteredNews.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all" 
                    ? "Try adjusting your search filters." 
                    : "Get started by creating your first news article."
                  }
                </p>
                {!searchQuery && selectedCategory === "all" && (
                  <Button asChild>
                    <Link to="/admin/news/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((article) => (
            <Card key={article.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {categoryLabels[article.category]}
                      </Badge>
                      <Badge className={statusColors[article.status]}>
                        {article.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground hover:text-primary transition-colors">
                      <Link to={`/admin/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </CardTitle>
                    <p className="text-muted-foreground mt-2 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                  {article.image && (
                    <div className="w-24 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(article.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Admin
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/news/${article.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/news/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{article.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article.id, article.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}