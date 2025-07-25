import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  MapPin,
  Plus,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";
import { EventCard } from "./EventCard";
import { EventForm } from "./EventForm";
import { CalendarView } from "./CalendarView";
import heroImage from "@/assets/hero-event-management.jpg";

// Mock data for demonstration
const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring the latest innovations in AI, blockchain, and web development.",
    date: "2024-08-15",
    time: "09:00",
    location: "San Francisco Convention Center",
    category: "Conference",
    attendees: 245,
    maxAttendees: 500,
    price: 149,
    status: "published" as const,
  },
  {
    id: "2", 
    title: "Summer Music Festival",
    description: "Three-day outdoor music festival featuring top artists from around the world.",
    date: "2024-07-20",
    time: "14:00",
    location: "Golden Gate Park",
    category: "Festival",
    attendees: 1200,
    maxAttendees: 1500,
    price: 85,
    status: "published" as const,
  },
  {
    id: "3",
    title: "Web Development Workshop",
    description: "Hands-on workshop covering modern React development techniques and best practices.",
    date: "2024-08-01",
    time: "10:00",
    location: "Tech Hub Downtown",
    category: "Workshop",
    attendees: 23,
    maxAttendees: 30,
    price: 0,
    status: "draft" as const,
  }
];

const mockStats = {
  totalEvents: 15,
  totalAttendees: 2847,
  revenue: 24680,
  upcomingEvents: 8
};

interface DashboardProps {
  organizerName?: string;
}

export const Dashboard = ({ organizerName = "Event Organizer" }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create-event' | 'calendar' | 'analytics'>('dashboard');
  const [events, setEvents] = useState(mockEvents);

  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      attendees: 0,
      status: 'draft' as const
    };
    setEvents(prev => [...prev, newEvent]);
    setCurrentView('dashboard');
  };

  const handleEditEvent = (id: string) => {
    console.log('Edit event:', id);
    // Would navigate to edit form with event data
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleViewAnalytics = (id: string) => {
    console.log('View analytics for event:', id);
    setCurrentView('analytics');
  };

  if (currentView === 'create-event') {
    return (
      <div className="min-h-screen bg-gradient-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('dashboard')}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details to create your event.</p>
          </div>
          
          <EventForm 
            onSubmit={handleCreateEvent}
            onCancel={() => setCurrentView('dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border p-6 shadow-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EventForge
            </h1>
            <p className="text-muted-foreground">Welcome back, {organizerName}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="hero" 
              onClick={() => setCurrentView('create-event')}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          <Button 
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={currentView === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('calendar')}
          >
            Calendar
          </Button>
          <Button 
            variant={currentView === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('analytics')}
          >
            Analytics
          </Button>
        </div>

        {currentView === 'dashboard' && (
          <>
            {/* Hero Section */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Event Management" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 flex items-center">
                <div className="p-8 text-white">
                  <h2 className="text-4xl font-bold mb-2">Transform Your Events</h2>
                  <p className="text-xl mb-4 text-white/90">
                    Manage everything from creation to analytics in one place
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary"
                    onClick={() => setCurrentView('create-event')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mockStats.totalEvents}</div>
                  <p className="text-xs text-success">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mockStats.totalAttendees.toLocaleString()}</div>
                  <p className="text-xs text-success">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">${mockStats.revenue.toLocaleString()}</div>
                  <p className="text-xs text-success">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0 bg-gradient-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{mockStats.upcomingEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Next 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Events</h2>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('create-event')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                    onViewAnalytics={handleViewAnalytics}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {currentView === 'calendar' && (
          <CalendarView events={events} />
        )}

        {currentView === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Track ticket sales, attendee demographics, and event performance
                </p>
                <Button variant="hero">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};