import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar
} from "lucide-react";
import { WaitlistManagement } from "./WaitlistManagement";
import { SeatingMap } from "./SeatingMap";

interface TicketingDashboardProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  maxAttendees: number;
  currentAttendees: number;
  onClose: () => void;
}

export const TicketingDashboard = ({ 
  eventId, 
  eventTitle, 
  eventDate, 
  maxAttendees, 
  currentAttendees, 
  onClose 
}: TicketingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const availableSpots = maxAttendees - currentAttendees;
  const occupancyRate = (currentAttendees / maxAttendees) * 100;

  // Mock ticket type data
  const ticketTypes = [
    { type: "VIP", sold: 15, total: 20, price: 299, revenue: 4485 },
    { type: "Premium", sold: 35, total: 50, price: 149, revenue: 5215 },
    { type: "General", sold: 195, total: 430, price: 49, revenue: 9555 }
  ];

  const totalRevenue = ticketTypes.reduce((sum, ticket) => sum + ticket.revenue, 0);

  if (activeTab === "waitlist") {
    return (
      <WaitlistManagement
        eventId={eventId}
        eventTitle={eventTitle}
        availableSpots={availableSpots}
        onClose={() => setActiveTab("overview")}
      />
    );
  }

  if (activeTab === "seating") {
    return (
      <SeatingMap
        eventId={eventId}
        eventTitle={eventTitle}
        onClose={() => setActiveTab("overview")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dynamic Ticketing</h2>
          <p className="text-muted-foreground">{eventTitle}</p>
        </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="seating">Seating Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{maxAttendees}</div>
                <p className="text-xs text-muted-foreground">
                  Maximum event capacity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Attendees</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{currentAttendees}</div>
                <p className="text-xs text-success">
                  {occupancyRate.toFixed(1)}% occupancy
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{availableSpots}</div>
                <p className="text-xs text-muted-foreground">
                  Remaining capacity
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-success">
                  +12% from projection
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Waitlist Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Manage attendees waiting for available spots when event reaches capacity.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">People waiting</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab("waitlist")}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Seating Map
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  View and manage seat assignments, availability, and pricing tiers.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Seats assigned</p>
                    <p className="text-2xl font-bold text-primary">{currentAttendees}</p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab("seating")}
                    variant="outline"
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    View Seating
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Type Breakdown */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle>Ticket Type Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketTypes.map((ticket, index) => {
                  const soldPercentage = (ticket.sold / ticket.total) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{ticket.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ${ticket.price} each
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {ticket.sold}/{ticket.total} sold
                          </p>
                          <p className="text-sm text-accent font-semibold">
                            ${ticket.revenue.toLocaleString()} revenue
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {soldPercentage.toFixed(1)}% sold
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-semibold">{new Date(eventDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sales Trend</p>
                    <p className="font-semibold text-success">+15% this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-success text-white border-0">
                      Active Sales
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};