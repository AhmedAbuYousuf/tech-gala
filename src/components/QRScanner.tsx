import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  User, 
  Camera,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com", 
    ticketId: "TKT-001-2024",
    checkedIn: false
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    ticketId: "TKT-002-2024", 
    checkedIn: true,
    checkedInAt: "2024-08-15T09:30:00Z"
  }
];

interface QRScannerProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export const QRScanner = ({ eventId, eventTitle, onClose }: QRScannerProps) => {
  const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees);
  const [scanInput, setScanInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleScanTicket = (ticketId: string) => {
    const attendee = attendees.find(a => a.ticketId === ticketId);
    
    if (!attendee) {
      toast({
        title: "Invalid Ticket",
        description: "Ticket not found for this event",
        variant: "destructive"
      });
      return;
    }

    if (attendee.checkedIn) {
      toast({
        title: "Already Checked In",
        description: `${attendee.name} was already checked in`,
        variant: "destructive"
      });
      return;
    }

    // Update check-in status
    setAttendees(prev => prev.map(a => 
      a.id === attendee.id 
        ? { ...a, checkedIn: true, checkedInAt: new Date().toISOString() }
        : a
    ));

    toast({
      title: "Check-in Successful",
      description: `${attendee.name} has been checked in`,
    });

    setScanInput("");
  };

  const handleManualScan = () => {
    if (!scanInput.trim()) return;
    handleScanTicket(scanInput.trim());
  };

  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const totalAttendees = attendees.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">QR Check-in Scanner</h2>
          <p className="text-muted-foreground">{eventTitle}</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close Scanner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold text-success">{checkedInCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold text-primary">{totalAttendees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-accent">{totalAttendees - checkedInCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanner Section */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center h-48 bg-muted/20 rounded-lg border-2 border-dashed border-border">
            <div className="text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Camera scanner would appear here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                (Demo: Use manual input below)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Manual Ticket ID Entry</label>
            <div className="flex gap-2">
              <Input
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter ticket ID (e.g., TKT-001-2024)"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
              />
              <Button onClick={handleManualScan}>
                <Search className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendee List */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle>Attendee List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendees.map(attendee => (
              <div 
                key={attendee.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-sm text-muted-foreground">{attendee.email}</p>
                    <p className="text-xs text-muted-foreground">{attendee.ticketId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {attendee.checkedIn ? (
                    <Badge variant="default" className="bg-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Checked In
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};