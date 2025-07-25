import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Download, 
  ExternalLink,
  CheckCircle,
  Clock,
  Smartphone,
  MonitorSpeaker
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventForSync {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface CalendarSyncProps {
  event: EventForSync;
  onClose: () => void;
}

const calendarProviders = [
  {
    id: "google",
    name: "Google Calendar",
    icon: Calendar,
    color: "text-blue-600",
    description: "Add to Google Calendar"
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: MonitorSpeaker,
    color: "text-blue-500",
    description: "Add to Outlook Calendar"
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: Smartphone,
    color: "text-gray-600",
    description: "Add to Apple Calendar"
  },
  {
    id: "ics",
    name: "Download ICS",
    icon: Download,
    color: "text-primary",
    description: "Download calendar file"
  }
];

export const CalendarSync = ({ event, onClose }: CalendarSyncProps) => {
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();

  const formatEventDateTime = () => {
    const eventDate = new Date(`${event.date}T${event.time}:00`);
    return {
      start: eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    };
  };

  const generateCalendarLink = (provider: string) => {
    const { start, end } = formatEventDateTime();
    const encodedTitle = encodeURIComponent(event.title);
    const encodedDescription = encodeURIComponent(event.description);
    const encodedLocation = encodeURIComponent(event.location);

    switch (provider) {
      case 'google':
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${start}/${end}&details=${encodedDescription}&location=${encodedLocation}`;
      
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${start}&enddt=${end}&body=${encodedDescription}&location=${encodedLocation}`;
      
      case 'apple':
        // For Apple Calendar, we'll generate an ICS file
        return generateICSContent();
      
      case 'ics':
        return generateICSContent();
      
      default:
        return '';
    }
  };

  const generateICSContent = () => {
    const { start, end } = formatEventDateTime();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventForge//Event//EN
BEGIN:VEVENT
UID:${event.id}@eventforge.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  };

  const handleCalendarSync = async (providerId: string) => {
    setSyncing(providerId);

    try {
      if (providerId === 'ics' || providerId === 'apple') {
        // Download ICS file
        const icsContent = generateICSContent();
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Calendar File Downloaded",
          description: `${providerId === 'apple' ? 'Apple Calendar' : 'ICS'} file has been downloaded`,
        });
      } else {
        // Open calendar provider in new tab
        const calendarLink = generateCalendarLink(providerId);
        window.open(calendarLink, '_blank');

        toast({
          title: "Calendar Opened",
          description: `${providerId === 'google' ? 'Google Calendar' : 'Outlook'} has been opened in a new tab`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync with calendar",
        variant: "destructive"
      });
    } finally {
      setSyncing(null);
    }
  };

  const eventDateTime = new Date(`${event.date}T${event.time}:00`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Add to Calendar</h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Event Summary */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium">
                  {eventDateTime.toLocaleDateString()} at {eventDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-sm text-muted-foreground">
                  {eventDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <div>
                <p className="font-medium">{event.location}</p>
                <p className="text-sm text-muted-foreground">Event location</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Options */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle>Choose Your Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarProviders.map(provider => (
              <Button
                key={provider.id}
                variant="outline"
                className="h-auto p-4 flex items-center gap-3 justify-start"
                onClick={() => handleCalendarSync(provider.id)}
                disabled={syncing === provider.id}
              >
                <provider.icon className={`w-6 h-6 ${provider.color}`} />
                <div className="text-left">
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                {syncing === provider.id ? (
                  <div className="ml-auto">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ExternalLink className="w-4 h-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-medium text-sm">How it works:</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Click on your preferred calendar provider</li>
                <li>• The event will open in your calendar app</li>
                <li>• Review and save the event to your calendar</li>
                <li>• You'll receive reminders based on your calendar settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};