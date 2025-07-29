import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  MapPin,
  Eye,
  Download,
  Filter,
  ArrowLeft,
  Target,
  Clock,
  Percent,
  Star,
  UserCheck,
  CreditCard,
  Share2
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface AnalyticsDashboardProps {
  onClose: () => void;
}

// Mock analytics data
const salesTrendData = [
  { month: 'Jan', revenue: 12000, tickets: 150, events: 3 },
  { month: 'Feb', revenue: 18000, tickets: 225, events: 4 },
  { month: 'Mar', revenue: 25000, tickets: 312, events: 6 },
  { month: 'Apr', revenue: 32000, tickets: 400, events: 8 },
  { month: 'May', revenue: 28000, tickets: 350, events: 7 },
  { month: 'Jun', revenue: 35000, tickets: 438, events: 9 },
];

const eventPerformanceData = [
  { name: 'Tech Conference 2024', revenue: 36400, attendees: 245, capacity: 500, satisfaction: 4.8 },
  { name: 'Summer Music Festival', revenue: 102000, attendees: 1200, capacity: 1500, satisfaction: 4.6 },
  { name: 'Web Dev Workshop', revenue: 0, attendees: 23, capacity: 30, satisfaction: 4.9 },
  { name: 'Business Summit', revenue: 28000, attendees: 140, capacity: 200, satisfaction: 4.4 },
  { name: 'Art Exhibition', revenue: 15000, attendees: 300, capacity: 400, satisfaction: 4.7 },
];

const audienceData = [
  { name: '18-25', value: 25, color: '#8B5CF6' },
  { name: '26-35', value: 35, color: '#06B6D4' },
  { name: '36-45', value: 22, color: '#10B981' },
  { name: '46-55', value: 12, color: '#F59E0B' },
  { name: '55+', value: 6, color: '#EF4444' }
];

const ticketTypeData = [
  { name: 'Early Bird', sold: 150, revenue: 12000, price: 80 },
  { name: 'Regular', sold: 200, revenue: 25000, price: 125 },
  { name: 'VIP', sold: 50, revenue: 15000, price: 300 },
  { name: 'Student', sold: 75, revenue: 3750, price: 50 }
];

const geographicData = [
  { location: 'San Francisco', attendees: 450, percentage: 28 },
  { location: 'Los Angeles', attendees: 320, percentage: 20 },
  { location: 'New York', attendees: 280, percentage: 17 },
  { location: 'Seattle', attendees: 200, percentage: 12 },
  { location: 'Chicago', attendees: 150, percentage: 9 },
  { location: 'Other', attendees: 226, percentage: 14 }
];

export const AnalyticsDashboard = ({ onClose }: AnalyticsDashboardProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');

  const totalRevenue = salesTrendData.reduce((sum, month) => sum + month.revenue, 0);
  const totalTickets = salesTrendData.reduce((sum, month) => sum + month.tickets, 0);
  const avgTicketPrice = totalRevenue / totalTickets;
  const conversionRate = 3.2; // Mock conversion rate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deep Analytics</h1>
            <p className="text-muted-foreground">Comprehensive insights into your event performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success">+23.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTickets.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success">+18.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Ticket Price</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${avgTicketPrice.toFixed(0)}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success">+4.1%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{conversionRate}%</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success">+0.8%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Sales Trend Chart */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Revenue & Ticket Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis yAxisId="left" className="text-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--accent))" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="tickets" stroke="hsl(var(--primary))" strokeWidth={3} name="Tickets Sold" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Event Performance Table */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Event Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventPerformanceData.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.attendees}/{event.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {event.satisfaction}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">${event.revenue.toLocaleString()}</div>
                      <Progress 
                        value={(event.attendees / event.capacity) * 100} 
                        className="w-24 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Demographics */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Age Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Attendee Behavior */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Attendee Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Check-in Time</span>
                  <span className="font-semibold">15 minutes early</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">No-show Rate</span>
                  <span className="font-semibold text-destructive">8.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Return Attendees</span>
                  <span className="font-semibold text-success">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Referral Rate</span>
                  <span className="font-semibold">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mobile Check-ins</span>
                  <span className="font-semibold">78%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Ticket Type */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Revenue by Ticket Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ticketTypeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ticket Sales Breakdown */}
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Ticket Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypeData.map((ticket, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{ticket.name}</span>
                      <Badge variant="outline">${ticket.price}</Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{ticket.sold} sold</span>
                      <span>${ticket.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(ticket.sold / 250) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{location.attendees} attendees</span>
                      <Badge variant="secondary">{location.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Growth Trends */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Growth Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictive Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Projected Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">$52,000</div>
                <p className="text-sm text-muted-foreground">Next month estimate</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">+28%</div>
                <p className="text-sm text-muted-foreground">Monthly growth trend</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Peak Season</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">Sep-Nov</div>
                <p className="text-sm text-muted-foreground">Highest demand period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};