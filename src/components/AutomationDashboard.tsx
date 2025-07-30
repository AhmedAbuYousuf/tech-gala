import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Clock, 
  Mail, 
  MessageCircle, 
  Users, 
  Calendar,
  Bell,
  ArrowRight,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Target,
  Timer,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: 'event_created' | 'ticket_purchased' | 'event_starts' | 'event_ends' | 'waitlist_joined' | 'custom_date';
  actions: WorkflowAction[];
  active: boolean;
  timesExecuted: number;
  lastExecuted?: string;
}

interface WorkflowAction {
  id: string;
  type: 'email' | 'sms' | 'webhook' | 'notification' | 'waitlist_invite';
  delay?: number; // in minutes
  config: any;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'reminder' | 'confirmation' | 'follow_up' | 'custom';
}

export const AutomationDashboard = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Event Registration Welcome',
      description: 'Send welcome email and reminders to new registrants',
      trigger: 'ticket_purchased',
      actions: [
        {
          id: '1',
          type: 'email',
          delay: 0,
          config: { templateId: 'welcome', subject: 'Welcome to {{event_name}}!' }
        },
        {
          id: '2', 
          type: 'email',
          delay: 10080, // 7 days in minutes
          config: { templateId: 'reminder', subject: 'Don\'t forget about {{event_name}}' }
        }
      ],
      active: true,
      timesExecuted: 156,
      lastExecuted: '2024-07-28T10:30:00Z'
    },
    {
      id: '2',
      name: 'Pre-Event Countdown',
      description: 'Send countdown reminders 24h and 1h before event',
      trigger: 'event_starts',
      actions: [
        {
          id: '3',
          type: 'email',
          delay: -1440, // 24 hours before
          config: { templateId: 'reminder', subject: '24 hours until {{event_name}}!' }
        },
        {
          id: '4',
          type: 'notification',
          delay: -60, // 1 hour before
          config: { message: 'Your event starts in 1 hour!' }
        }
      ],
      active: true,
      timesExecuted: 89,
      lastExecuted: '2024-07-27T08:00:00Z'
    },
    {
      id: '3',
      name: 'Post-Event Follow Up',
      description: 'Thank attendees and collect feedback',
      trigger: 'event_ends',
      actions: [
        {
          id: '5',
          type: 'email',
          delay: 60, // 1 hour after
          config: { templateId: 'follow_up', subject: 'Thank you for attending {{event_name}}!' }
        }
      ],
      active: true,
      timesExecuted: 23,
      lastExecuted: '2024-07-25T18:00:00Z'
    }
  ]);

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to {{event_name}}!',
      content: 'Thank you for registering for {{event_name}}. We\'re excited to have you join us on {{event_date}}.',
      type: 'welcome'
    },
    {
      id: 'reminder',
      name: 'Event Reminder',
      subject: 'Reminder: {{event_name}} is coming up!',
      content: 'This is a friendly reminder that {{event_name}} is happening on {{event_date}} at {{event_time}}.',
      type: 'reminder'
    },
    {
      id: 'follow_up',
      name: 'Post-Event Thank You',
      subject: 'Thank you for attending {{event_name}}!',
      content: 'Thank you for attending {{event_name}}. We hope you had a great experience!',
      type: 'follow_up'
    }
  ]);

  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: 'ticket_purchased' as const,
  });

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom' as const
  });

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      trigger: newWorkflow.trigger,
      actions: [],
      active: false,
      timesExecuted: 0
    };

    setWorkflows(prev => [...prev, workflow]);
    setNewWorkflow({ name: '', description: '', trigger: 'ticket_purchased' });
    toast.success('Workflow created successfully!');
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Email template created successfully!');
    setNewTemplate({ name: '', subject: '', content: '', type: 'custom' });
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, active: !w.active } : w
    ));
    const workflow = workflows.find(w => w.id === workflowId);
    toast.success(`Workflow ${workflow?.active ? 'deactivated' : 'activated'}`);
  };

  const executeWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      toast.success(`Executing workflow: ${workflow.name}`);
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'event_created':
        return <Plus className="h-4 w-4" />;
      case 'ticket_purchased':
        return <Target className="h-4 w-4" />;
      case 'event_starts':
        return <Play className="h-4 w-4" />;
      case 'event_ends':
        return <CheckCircle className="h-4 w-4" />;
      case 'waitlist_joined':
        return <Users className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'sms':
        return <MessageCircle className="h-3 w-3" />;
      case 'notification':
        return <Bell className="h-3 w-3" />;
      case 'webhook':
        return <Zap className="h-3 w-3" />;
      default:
        return <Settings className="h-3 w-3" />;
    }
  };

  const formatDelay = (delay: number) => {
    if (delay === 0) return 'Immediately';
    if (delay < 0) return `${Math.abs(delay / 60)} hours before`;
    if (delay < 60) return `${delay} minutes after`;
    if (delay < 1440) return `${delay / 60} hours after`;
    return `${delay / 1440} days after`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automation & Workflows</h2>
          <p className="text-muted-foreground">
            Automate your event communications and processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Automation Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.filter(w => w.active).length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {workflows.length} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions Today</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Delivery success
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create New Workflow</CardTitle>
                <CardDescription>
                  Set up automated actions triggered by event activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    placeholder="Welcome New Attendees"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    placeholder="Send welcome email and reminders..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-trigger">Trigger</Label>
                  <Select
                    value={newWorkflow.trigger}
                    onValueChange={(value: any) => setNewWorkflow({ ...newWorkflow, trigger: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ticket_purchased">Ticket Purchased</SelectItem>
                      <SelectItem value="event_created">Event Created</SelectItem>
                      <SelectItem value="event_starts">Event Starts</SelectItem>
                      <SelectItem value="event_ends">Event Ends</SelectItem>
                      <SelectItem value="waitlist_joined">Waitlist Joined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateWorkflow} className="w-full">
                  Create Workflow
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>
                  Manage your automated workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTriggerIcon(workflow.trigger)}
                          <span className="font-medium">{workflow.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={workflow.active}
                            onCheckedChange={() => toggleWorkflow(workflow.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => executeWorkflow(workflow.id)}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{workflow.description}</div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <span>Executed: {workflow.timesExecuted} times</span>
                        </div>
                        <Badge variant={workflow.active ? "default" : "secondary"}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {workflow.actions.map((action, index) => (
                          <div key={action.id} className="flex items-center space-x-2 text-xs">
                            {getActionIcon(action.type)}
                            <span className="capitalize">{action.type}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{formatDelay(action.delay || 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Email Template</CardTitle>
                <CardDescription>
                  Design reusable email templates for your workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Welcome Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-type">Type</Label>
                  <Select
                    value={newTemplate.type}
                    onValueChange={(value: any) => setNewTemplate({ ...newTemplate, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="confirmation">Confirmation</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Subject Line</Label>
                  <Input
                    id="template-subject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                    placeholder="Welcome to {{event_name}}!"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-content">Email Content</Label>
                  <Textarea
                    id="template-content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    placeholder="Dear {{attendee_name}}, thank you for registering..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleCreateTemplate} className="w-full">
                  Create Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Manage your email templates and variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{template.name}</div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{template.subject}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{template.content}</div>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                  <div className="space-y-2">
                  <h4 className="font-medium text-sm">Available Variables</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <code className="bg-muted px-2 py-1 rounded">{'{{event_name}}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{{event_date}}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{{event_time}}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{{attendee_name}}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{{ticket_type}}'}</code>
                    <code className="bg-muted px-2 py-1 rounded">{'{{location}}'}</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>
                  Track the effectiveness of your automated workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Executed {workflow.timesExecuted} times
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {workflow.timesExecuted > 0 ? '98%' : 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Campaign Stats</CardTitle>
                <CardDescription>
                  Monitor your automated email performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-sm text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">89%</div>
                      <div className="text-sm text-muted-foreground">Open Rate</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">45%</div>
                      <div className="text-sm text-muted-foreground">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.1%</div>
                      <div className="text-sm text-muted-foreground">Bounce Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>
                Configure global settings for your automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Enable Automation</div>
                  <div className="text-sm text-muted-foreground">
                    Turn automation on/off globally
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Email Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    defaultValue="events@eventforge.com"
                    placeholder="events@yourcompany.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    defaultValue="EventForge"
                    placeholder="Your Company Name"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Rate Limiting</h4>
                <div className="space-y-2">
                  <Label htmlFor="email-limit">Max Emails per Hour</Label>
                  <Input
                    id="email-limit"
                    type="number"
                    defaultValue="100"
                    placeholder="100"
                  />
                </div>
              </div>
              
              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};