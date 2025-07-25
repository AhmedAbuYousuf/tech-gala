import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    attendees: number;
    maxAttendees: number;
    price: number;
    image?: string;
    status: 'draft' | 'published' | 'cancelled';
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
}

export const EventCard = ({ event, onEdit, onDelete, onViewAnalytics }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-warning';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-0">
      <div className="relative">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-primary flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary-foreground opacity-60" />
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${getStatusColor(event.status)} text-white border-0`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-background/90 text-foreground border-0"
        >
          {event.category}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {event.description}
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(event.date)}</span>
              <Clock className="w-4 h-4 text-primary ml-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{event.attendees}/{event.maxAttendees} attendees</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="font-semibold text-accent">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit?.(event.id)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewAnalytics?.(event.id)}
              className="flex-1"
            >
              Analytics
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete?.(event.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};