import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  Newspaper, 
  Calendar, 
  Images, 
  Users, 
  TrendingUp,
  Clock
} from "lucide-react";

const stats = [
  {
    title: "Total News Articles",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Newspaper,
    color: "text-blue-600"
  },
  {
    title: "Upcoming Events",
    value: "8",
    change: "+4",
    trend: "up", 
    icon: Calendar,
    color: "text-green-600"
  },
  {
    title: "Gallery Items",
    value: "156",
    change: "+18",
    trend: "up",
    icon: Images,
    color: "text-purple-600"
  },
  {
    title: "Total Users",
    value: "2,847",
    change: "+127",
    trend: "up",
    icon: Users,
    color: "text-orange-600"
  }
];

const recentActivity = [
  {
    action: "Published new article",
    title: "Research Center Opening",
    time: "2 hours ago",
    type: "news"
  },
  {
    action: "Created event",
    title: "Annual Sports Festival",
    time: "4 hours ago",
    type: "event"
  },
  {
    action: "Updated gallery",
    title: "Campus Life Collection",
    time: "6 hours ago",
    type: "gallery"
  },
  {
    action: "Published article",
    title: "Spring Registration Open",
    time: "1 day ago",
    type: "news"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your club portal.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/admin/news/create"
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
              >
                <Newspaper className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Create News Article</p>
                  <p className="text-sm text-muted-foreground">Publish latest updates</p>
                </div>
              </Link>

              <Link
                to="/admin/events/create"
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
              >
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Add New Event</p>
                  <p className="text-sm text-muted-foreground">Schedule upcoming events</p>
                </div>
              </Link>

              <Link
                to="/admin/gallery/create"
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors text-left"
              >
                <Images className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Upload to Gallery</p>
                  <p className="text-sm text-muted-foreground">Add new photos</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}