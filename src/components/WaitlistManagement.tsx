import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Send
} from "lucide-react";
import { toast } from "sonner";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'waiting' | 'notified' | 'confirmed' | 'declined';
  notes?: string;
  position: number;
}

interface WaitlistManagementProps {
  eventId: string;
  eventTitle: string;
  availableSpots: number;
  onClose: () => void;
}

// Mock waitlist data
const mockWaitlist: WaitlistEntry[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234-567-8901",
    registrationDate: "2024-01-15T10:30:00Z",
    priority: "high",
    status: "waiting",
    notes: "VIP member",
    position: 1
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    registrationDate: "2024-01-16T14:20:00Z",
    priority: "medium",
    status: "notified",
    position: 2
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    phone: "+1 234-567-8903",
    registrationDate: "2024-01-17T09:15:00Z",
    priority: "low",
    status: "confirmed",
    position: 3
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@example.com",
    registrationDate: "2024-01-18T16:45:00Z",
    priority: "medium",
    status: "waiting",
    position: 4
  }
];

export const WaitlistManagement = ({ eventId, eventTitle, availableSpots, onClose }: WaitlistManagementProps) => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(mockWaitlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    email: "",
    phone: "",
    priority: "medium" as const,
    notes: ""
  });

  const filteredWaitlist = waitlist.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-warning';
      case 'notified': return 'bg-accent';
      case 'confirmed': return 'bg-success';
      case 'declined': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const handleNotifyNext = () => {
    const nextWaiting = waitlist.find(entry => entry.status === 'waiting');
    if (nextWaiting && availableSpots > 0) {
      setWaitlist(prev => prev.map(entry => 
        entry.id === nextWaiting.id 
          ? { ...entry, status: 'notified' as const }
          : entry
      ));
      toast.success(`Notification sent to ${nextWaiting.name}`);
    } else {
      toast.error("No available spots or waiting entries");
    }
  };

  const handleBulkNotify = () => {
    if (selectedEntries.length === 0 || availableSpots === 0) {
      toast.error("Select entries to notify and ensure spots are available");
      return;
    }

    const notifyCount = Math.min(selectedEntries.length, availableSpots);
    const entriesToNotify = selectedEntries.slice(0, notifyCount);
    
    setWaitlist(prev => prev.map(entry => 
      entriesToNotify.includes(entry.id) && entry.status === 'waiting'
        ? { ...entry, status: 'notified' as const }
        : entry
    ));
    
    setSelectedEntries([]);
    toast.success(`Notifications sent to ${notifyCount} people`);
  };

  const handleStatusChange = (entryId: string, newStatus: WaitlistEntry['status']) => {
    setWaitlist(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: newStatus }
        : entry
    ));
    toast.success("Status updated successfully");
  };

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.email) {
      toast.error("Name and email are required");
      return;
    }

    const entry: WaitlistEntry = {
      id: Date.now().toString(),
      ...newEntry,
      registrationDate: new Date().toISOString(),
      status: 'waiting',
      position: waitlist.length + 1
    };

    setWaitlist(prev => [...prev, entry]);
    setNewEntry({ name: "", email: "", phone: "", priority: "medium", notes: "" });
    setIsAddingEntry(false);
    toast.success("Entry added to waitlist");
  };

  const handleRemoveEntry = (entryId: string) => {
    setWaitlist(prev => prev.filter(entry => entry.id !== entryId));
    toast.success("Entry removed from waitlist");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Waitlist Management</h2>
          <p className="text-muted-foreground">{eventTitle}</p>
        </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Waiting</p>
                <p className="text-xl font-bold text-primary">
                  {waitlist.filter(e => e.status === 'waiting').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Notified</p>
                <p className="text-xl font-bold text-accent">
                  {waitlist.filter(e => e.status === 'notified').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-xl font-bold text-success">
                  {waitlist.filter(e => e.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Available Spots</p>
                <p className="text-xl font-bold text-warning">{availableSpots}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={handleNotifyNext}
            disabled={availableSpots === 0}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Notify Next
          </Button>
          <Button 
            onClick={handleBulkNotify}
            disabled={selectedEntries.length === 0 || availableSpots === 0}
            variant="outline"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Bulk Notify ({selectedEntries.length})
          </Button>
          <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-card border-0">
              <DialogHeader>
                <DialogTitle>Add Waitlist Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEntry.name}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEntry.email}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={newEntry.phone}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newEntry.priority}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} className="flex-1">Add to Waitlist</Button>
                  <Button onClick={() => setIsAddingEntry(false)} variant="outline">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="notified">Notified</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Waitlist Table */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWaitlist.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedEntries.includes(entry.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEntries(prev => [...prev, entry.id]);
                    } else {
                      setSelectedEntries(prev => prev.filter(id => id !== entry.id));
                    }
                  }}
                  className="rounded"
                />
                
                <div className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {entry.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{entry.name}</h4>
                      <Badge className={`${getPriorityColor(entry.priority)} text-white border-0 text-xs`}>
                        {entry.priority}
                      </Badge>
                      <Badge className={`${getStatusColor(entry.status)} text-white border-0 text-xs`}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {entry.email}
                      </span>
                      {entry.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {entry.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Position {entry.position}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Note: {entry.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {entry.status === 'waiting' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(entry.id, 'notified')}
                      className="gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Notify
                    </Button>
                  )}
                  {entry.status === 'notified' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(entry.id, 'confirmed')}
                        className="gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(entry.id, 'declined')}
                        className="gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Decline
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};