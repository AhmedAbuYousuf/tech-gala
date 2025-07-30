import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Megaphone, 
  Share2, 
  Percent, 
  Mail, 
  Users, 
  TrendingUp, 
  Target, 
  Calendar,
  Copy,
  ExternalLink,
  Gift,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  type: 'social' | 'email' | 'discount' | 'referral';
  status: 'active' | 'paused' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
}

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usage: number;
  limit: number;
  expiresAt: string;
  active: boolean;
}

export const MarketingDashboard = () => {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer Concert Series',
      type: 'social',
      status: 'active',
      reach: 15420,
      engagement: 2340,
      conversions: 156,
      budget: 5000,
      spent: 3200,
      startDate: '2024-07-01',
      endDate: '2024-08-31'
    },
    {
      id: '2',
      name: 'Early Bird Special',
      type: 'email',
      status: 'active',
      reach: 8900,
      engagement: 1890,
      conversions: 287,
      budget: 2000,
      spent: 1200,
      startDate: '2024-07-15',
      endDate: '2024-08-15'
    }
  ]);

  const [discountCodes] = useState<DiscountCode[]>([
    {
      id: '1',
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      usage: 145,
      limit: 500,
      expiresAt: '2024-08-31',
      active: true
    },
    {
      id: '2',
      code: 'EARLYBIRD',
      type: 'fixed',
      value: 50,
      usage: 67,
      limit: 200,
      expiresAt: '2024-08-15',
      active: true
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'social' as const,
    budget: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [newDiscountCode, setNewDiscountCode] = useState({
    code: '',
    type: 'percentage' as const,
    value: '',
    limit: '',
    expiresAt: ''
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.budget) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Campaign created successfully!');
    setNewCampaign({
      name: '',
      type: 'social',
      budget: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  const handleCreateDiscountCode = () => {
    if (!newDiscountCode.code || !newDiscountCode.value) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Discount code created successfully!');
    setNewDiscountCode({
      code: '',
      type: 'percentage',
      value: '',
      limit: '',
      expiresAt: ''
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareOnSocial = (platform: string) => {
    toast.success(`Shared on ${platform}!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCampaignIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <Share2 className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'discount':
        return <Percent className="h-4 w-4" />;
      case 'referral':
        return <Users className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marketing Promotion</h2>
          <p className="text-muted-foreground">
            Manage promotional campaigns, discount codes, and marketing analytics
          </p>
        </div>
        <Button>
          <Megaphone className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Marketing Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,320</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">443</div>
            <p className="text-xs text-muted-foreground">
              +18.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2x</div>
            <p className="text-xs text-muted-foreground">
              +0.4x from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
          <TabsTrigger value="social">Social Sharing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
                <CardDescription>
                  Launch a new marketing campaign to promote your events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="Summer Concert Series"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value: any) => setNewCampaign({ ...newCampaign, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="discount">Discount Campaign</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-budget">Budget ($)</Label>
                    <Input
                      id="campaign-budget"
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-start">Start Date</Label>
                    <Input
                      id="campaign-start"
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-description">Description</Label>
                  <Textarea
                    id="campaign-description"
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    placeholder="Describe your campaign goals and target audience..."
                  />
                </div>
                <Button onClick={handleCreateCampaign} className="w-full">
                  Create Campaign
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>
                  Monitor and manage your ongoing marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCampaignIcon(campaign.type)}
                          <span className="font-medium">{campaign.name}</span>
                        </div>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Reach</div>
                          <div className="font-medium">{campaign.reach.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conversions</div>
                          <div className="font-medium">{campaign.conversions}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Budget</div>
                          <div className="font-medium">${campaign.spent}/${campaign.budget}</div>
                        </div>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Discount Code</CardTitle>
                <CardDescription>
                  Generate promotional discount codes for your events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discount-code">Discount Code</Label>
                  <Input
                    id="discount-code"
                    value={newDiscountCode.code}
                    onChange={(e) => setNewDiscountCode({ ...newDiscountCode, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-type">Type</Label>
                    <Select
                      value={newDiscountCode.type}
                      onValueChange={(value: any) => setNewDiscountCode({ ...newDiscountCode, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-value">
                      Value {newDiscountCode.type === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="discount-value"
                      type="number"
                      value={newDiscountCode.value}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, value: e.target.value })}
                      placeholder={newDiscountCode.type === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount-limit">Usage Limit</Label>
                    <Input
                      id="discount-limit"
                      type="number"
                      value={newDiscountCode.limit}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, limit: e.target.value })}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-expires">Expires At</Label>
                    <Input
                      id="discount-expires"
                      type="date"
                      value={newDiscountCode.expiresAt}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, expiresAt: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateDiscountCode} className="w-full">
                  Create Discount Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Discount Codes</CardTitle>
                <CardDescription>
                  Manage your promotional discount codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountCodes.map((code) => (
                    <div key={code.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {code.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Badge variant={code.active ? "default" : "secondary"}>
                          {code.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Value</div>
                          <div className="font-medium">
                            {code.type === 'percentage' ? `${code.value}%` : `$${code.value}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Usage</div>
                          <div className="font-medium">{code.usage}/{code.limit}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Expires</div>
                          <div className="font-medium">{new Date(code.expiresAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Progress value={(code.usage / code.limit) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Sharing</CardTitle>
              <CardDescription>
                Share your events and promotions across social platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Facebook', color: 'bg-blue-600', icon: Share2 },
                  { name: 'Twitter', color: 'bg-sky-500', icon: Share2 },
                  { name: 'Instagram', color: 'bg-pink-600', icon: Share2 },
                  { name: 'LinkedIn', color: 'bg-blue-700', icon: Share2 },
                  { name: 'TikTok', color: 'bg-black', icon: Share2 },
                  { name: 'WhatsApp', color: 'bg-green-600', icon: Share2 }
                ].map((platform) => (
                  <Card key={platform.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${platform.color}`}>
                            <platform.icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareOnSocial(platform.name)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Quick Share Template</h4>
                <Textarea
                  placeholder="🎉 Don't miss our amazing Summer Concert Series! Use code SUMMER20 for 20% off tickets. Limited time offer! #EventPromo #MusicFest"
                  className="mb-3"
                />
                <div className="flex space-x-2">
                  <Button size="sm">Share Now</Button>
                  <Button variant="outline" size="sm">Schedule Post</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Track the performance of your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{campaign.name}</span>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Conversion Rate</div>
                          <div className="font-medium">
                            {((campaign.conversions / campaign.reach) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Cost per Conversion</div>
                          <div className="font-medium">
                            ${(campaign.spent / campaign.conversions).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discount Code Analytics</CardTitle>
                <CardDescription>
                  Monitor the usage and effectiveness of discount codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountCodes.map((code) => (
                    <div key={code.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {code.code}
                        </code>
                        <div className="text-sm text-muted-foreground">
                          {((code.usage / code.limit) * 100).toFixed(0)}% used
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Total Savings</div>
                          <div className="font-medium">
                            ${code.type === 'percentage' 
                              ? (code.usage * 50 * code.value / 100).toFixed(0)
                              : (code.usage * code.value).toFixed(0)
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Revenue Impact</div>
                          <div className="font-medium">
                            ${(code.usage * 200).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};