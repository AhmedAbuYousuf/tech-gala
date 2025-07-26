import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  Copy, 
  ExternalLink,
  Shield,
  Mic,
  Camera,
  Share2,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Meeting {
  id: string;
  title: string;
  platform: 'zoom' | 'meet';
  meetingId: string;
  joinUrl: string;
  startTime: string;
  duration: number;
  hostEmail: string;
  password?: string;
  waitingRoom: boolean;
  recordMeeting: boolean;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  eventId?: string;
}

interface VideoIntegrationProps {
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  onClose?: () => void;
}

export const VideoIntegration: React.FC<VideoIntegrationProps> = ({
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  onClose
}) => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Tech Conference 2024 - Main Session',
      platform: 'zoom',
      meetingId: '123-456-789',
      joinUrl: 'https://zoom.us/j/123456789',
      startTime: '2024-08-15T09:00:00',
      duration: 120,
      hostEmail: 'host@example.com',
      password: 'TechConf2024',
      waitingRoom: true,
      recordMeeting: true,
      participants: 0,
      maxParticipants: 500,
      status: 'scheduled',
      eventId: '1'
    },
    {
      id: '2',
      title: 'Workshop - React Development',
      platform: 'meet',
      meetingId: 'xyz-abc-def',
      joinUrl: 'https://meet.google.com/xyz-abc-def',
      startTime: '2024-08-01T10:00:00',
      duration: 180,
      hostEmail: 'workshop@example.com',
      waitingRoom: false,
      recordMeeting: false,
      participants: 12,
      maxParticipants: 30,
      status: 'scheduled',
      eventId: '3'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'zoom' | 'meet'>('zoom');
  const [isConnected, setIsConnected] = useState({ zoom: false, meet: true });
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const { toast } = useToast();

  // Form state for creating new meetings
  const [newMeeting, setNewMeeting] = useState({
    title: eventTitle || '',
    platform: 'zoom' as 'zoom' | 'meet',
    startTime: eventDate && eventTime ? `${eventDate}T${eventTime}` : '',
    duration: 60,
    password: '',
    waitingRoom: true,
    recordMeeting: false,
    maxParticipants: 100,
    agenda: ''
  });

  const handleCreateMeeting = async () => {
    if (!newMeeting.title || !newMeeting.startTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!isConnected[newMeeting.platform]) {
      toast({
        title: "Platform Not Connected",
        description: `Please connect your ${newMeeting.platform === 'zoom' ? 'Zoom' : 'Google Meet'} account first`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create meeting
      await new Promise(resolve => setTimeout(resolve, 2000));

      const meetingId = Math.random().toString(36).substring(2, 15);
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        platform: newMeeting.platform,
        meetingId: meetingId,
        joinUrl: newMeeting.platform === 'zoom' 
          ? `https://zoom.us/j/${meetingId.replace(/-/g, '')}`
          : `https://meet.google.com/${meetingId}`,
        startTime: newMeeting.startTime,
        duration: newMeeting.duration,
        hostEmail: 'user@example.com',
        password: newMeeting.password,
        waitingRoom: newMeeting.waitingRoom,
        recordMeeting: newMeeting.recordMeeting,
        participants: 0,
        maxParticipants: newMeeting.maxParticipants,
        status: 'scheduled',
        eventId
      };

      setMeetings(prev => [...prev, meeting]);
      setIsCreating(false);
      
      // Reset form
      setNewMeeting({
        title: eventTitle || '',
        platform: 'zoom',
        startTime: eventDate && eventTime ? `${eventDate}T${eventTime}` : '',
        duration: 60,
        password: '',
        waitingRoom: true,
        recordMeeting: false,
        maxParticipants: 100,
        agenda: ''
      });

      toast({
        title: "Meeting Created",
        description: `${newMeeting.platform === 'zoom' ? 'Zoom' : 'Google Meet'} meeting created successfully`,
      });

      // Trigger Zapier webhook if configured
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify({
              action: "meeting_created",
              meeting: meeting,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error("Webhook error:", error);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: 'zoom' | 'meet') => {
    setIsLoading(true);
    
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(prev => ({ ...prev, [platform]: true }));
      
      toast({
        title: "Connected Successfully",
        description: `Your ${platform === 'zoom' ? 'Zoom' : 'Google Meet'} account has been connected`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try connecting again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    window.open(meeting.joinUrl, '_blank');
    
    toast({
      title: "Joining Meeting",
      description: `Opening ${meeting.platform === 'zoom' ? 'Zoom' : 'Google Meet'} in a new window`,
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Meeting link copied to clipboard",
    });
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    toast({
      title: "Meeting Deleted",
      description: "The meeting has been removed",
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'live':
        return 'bg-green-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: 'zoom' | 'meet') => {
    return <Video className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Video Integration</h2>
          <p className="text-muted-foreground">Manage Zoom and Google Meet meetings for your events</p>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            ← Back
          </Button>
        )}
      </div>

      <Tabs defaultValue="meetings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meetings">My Meetings</TabsTrigger>
          <TabsTrigger value="create">Create Meeting</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Meeting
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-card border-0 bg-gradient-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(meeting.platform)}
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={cn("text-white", getStatusColor(meeting.status))}
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDateTime(meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{meeting.participants}/{meeting.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Meeting ID: {meeting.meetingId}
                      </Badge>
                      {meeting.password && (
                        <Badge variant="outline" className="text-xs">
                          Password: {meeting.password}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleJoinMeeting(meeting)}
                      className="flex-1"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCopyLink(meeting.joinUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {meetings.length === 0 && (
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardContent className="p-8 text-center">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No meetings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first video meeting to get started
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  Create Meeting
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Create New Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select 
                  value={newMeeting.platform} 
                  onValueChange={(value: 'zoom' | 'meet') => setNewMeeting(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Zoom
                        {!isConnected.zoom && <AlertCircle className="w-4 h-4 text-warning" />}
                      </div>
                    </SelectItem>
                    <SelectItem value="meet">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Google Meet
                        {!isConnected.meet && <AlertCircle className="w-4 h-4 text-warning" />}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newMeeting.startTime}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    min="15"
                    max="1440"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Meeting Password</Label>
                  <Input
                    id="password"
                    value={newMeeting.password}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newMeeting.maxParticipants}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                    min="2"
                    max="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                  placeholder="Meeting agenda (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Waiting Room</Label>
                    <p className="text-sm text-muted-foreground">
                      Participants wait for host approval
                    </p>
                  </div>
                  <Switch
                    checked={newMeeting.waitingRoom}
                    onCheckedChange={(checked) => setNewMeeting(prev => ({ ...prev, waitingRoom: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Record Meeting</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically record this meeting
                    </p>
                  </div>
                  <Switch
                    checked={newMeeting.recordMeeting}
                    onCheckedChange={(checked) => setNewMeeting(prev => ({ ...prev, recordMeeting: checked }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateMeeting}
                disabled={isLoading || !isConnected[newMeeting.platform]}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Meeting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Meeting
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Platform Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">Zoom</h4>
                      <p className="text-sm text-muted-foreground">
                        {isConnected.zoom ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected.zoom ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    )}
                    <Button
                      variant={isConnected.zoom ? "outline" : "default"}
                      onClick={() => handleConnectPlatform('zoom')}
                      disabled={isLoading}
                    >
                      {isConnected.zoom ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Google Meet</h4>
                      <p className="text-sm text-muted-foreground">
                        {isConnected.meet ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected.meet ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    )}
                    <Button
                      variant={isConnected.meet ? "outline" : "default"}
                      onClick={() => handleConnectPlatform('meet')}
                      disabled={isLoading}
                    >
                      {isConnected.meet ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Zapier Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook">Zapier Webhook URL</Label>
                <Input
                  id="webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                />
                <p className="text-sm text-muted-foreground">
                  Automatically trigger Zaps when meetings are created or updated
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};