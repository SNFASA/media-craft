import { useParams, useNavigate, Link } from "react-router-dom";
import { useNewsStore } from "@/stores/newsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, User, Eye, Share } from "lucide-react";

const categoryLabels = {
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

export default function ViewNews() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNews } = useNewsStore();

  const article = id ? getNews(id) : null;

  if (!article) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-foreground mb-2">Article not found</h3>
              <p className="text-muted-foreground mb-4">
                The article you're looking for doesn't exist or has been deleted.
              </p>
              <Button asChild>
                <Link to="/admin/news">Return to News</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button asChild size="sm">
            <Link to={`/admin/news/${article.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-soft">
          <CardHeader className="space-y-4">
            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {categoryLabels[article.category]}
              </Badge>
              <Badge className={statusColors[article.status]}>
                {article.status}
              </Badge>
            </div>

            {/* Title */}
            <CardTitle className="text-3xl text-foreground leading-tight">
              {article.title}
            </CardTitle>

            {/* Description */}
            {article.description && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.description}
              </p>
            )}

            {/* Article meta */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(article.createdAt)}</span>
              </div>
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Published {formatDate(article.publishedAt)}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Featured Image */}
            {article.image && (
              <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-gray max-w-none">
              <div 
                className="text-foreground leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
              {!article.content && (
                <p className="text-muted-foreground italic">
                  No content has been added to this article yet.
                </p>
              )}
            </div>

            {/* Article Footer */}
            <div className="pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <p>Last updated: {formatDate(article.updatedAt)}</p>
                  <p>Slug: <code className="bg-muted px-2 py-1 rounded text-xs">{article.slug}</code></p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/news/${article.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Article
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}