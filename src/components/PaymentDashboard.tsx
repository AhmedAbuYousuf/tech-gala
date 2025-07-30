import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  DollarSign, 
  Ticket, 
  Users, 
  TrendingUp, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  Wallet,
  Shield,
  AlertTriangle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentData {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  ticketType: string;
  quantity: number;
  createdAt: string;
  stripePaymentId?: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  availableQuantity: number;
  soldQuantity: number;
  active: boolean;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  pendingRefunds: number;
  processingFees: number;
  netRevenue: number;
}

export const PaymentDashboard = () => {
  const [payments] = useState<PaymentData[]>([
    {
      id: '1',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      amount: 149.00,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Visa ***4242',
      ticketType: 'General Admission',
      quantity: 1,
      createdAt: '2024-07-28T10:30:00Z',
      stripePaymentId: 'pi_1234567890'
    },
    {
      id: '2',
      eventId: '2',
      eventTitle: 'Summer Music Festival',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      amount: 170.00,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'Mastercard ***8888',
      ticketType: 'VIP Package',
      quantity: 2,
      createdAt: '2024-07-27T15:45:00Z',
      stripePaymentId: 'pi_0987654321'
    },
    {
      id: '3',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      customerName: 'Mike Davis',
      customerEmail: 'mike@example.com',
      amount: 149.00,
      currency: 'USD',
      status: 'pending',
      paymentMethod: 'American Express ***1234',
      ticketType: 'General Admission',
      quantity: 1,
      createdAt: '2024-07-28T12:15:00Z'
    }
  ]);

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: '1',
      name: 'General Admission',
      price: 149.00,
      description: 'Access to all conference sessions and networking events',
      availableQuantity: 500,
      soldQuantity: 245,
      active: true
    },
    {
      id: '2',
      name: 'VIP Package',
      price: 299.00,
      description: 'Premium seating, exclusive networking, and conference swag',
      availableQuantity: 100,
      soldQuantity: 67,
      active: true
    },
    {
      id: '3',
      name: 'Student Discount',
      price: 79.00,
      description: 'Discounted rate for students with valid ID',
      availableQuantity: 50,
      soldQuantity: 23,
      active: true
    }
  ]);

  const [paymentStats] = useState<PaymentStats>({
    totalRevenue: 45680.00,
    totalTransactions: 187,
    pendingRefunds: 2,
    processingFees: 1370.40,
    netRevenue: 44309.60
  });

  const [newTicketType, setNewTicketType] = useState({
    name: '',
    price: '',
    description: '',
    availableQuantity: '',
  });

  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCreateTicketType = () => {
    if (!newTicketType.name || !newTicketType.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticketType: TicketType = {
      id: Date.now().toString(),
      name: newTicketType.name,
      price: parseFloat(newTicketType.price),
      description: newTicketType.description,
      availableQuantity: parseInt(newTicketType.availableQuantity) || 100,
      soldQuantity: 0,
      active: true
    };

    setTicketTypes(prev => [...prev, ticketType]);
    setNewTicketType({ name: '', price: '', description: '', availableQuantity: '' });
    toast.success('Ticket type created successfully!');
  };

  const handleProcessRefund = async (paymentId: string) => {
    setIsProcessingRefund(true);
    try {
      // In a real implementation, this would call your refund API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Refund processed successfully');
    } catch (error) {
      toast.error('Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const initiateStripeCheckout = async (ticketTypeId: string) => {
    const ticketType = ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return;

    try {
      // In a real implementation, this would call your Stripe checkout API
      toast.success(`Initiating checkout for ${ticketType.name} - $${ticketType.price}`);
      // Simulate redirect to Stripe checkout
      console.log('Redirecting to Stripe checkout...');
    } catch (error) {
      toast.error('Failed to initiate checkout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
          <p className="text-muted-foreground">
            Manage payments, ticket sales, and financial analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Security Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Payment Link
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              +23 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentStats.processingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              3.2% of total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentStats.netRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              After fees and refunds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.pendingRefunds}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Types</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-muted-foreground">{payment.customerEmail}</div>
                      </div>
                      <div>
                        <div className="font-medium">{payment.eventTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {payment.quantity}x {payment.ticketType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${payment.amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{payment.paymentMethod}</div>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                      {payment.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProcessRefund(payment.id)}
                          disabled={isProcessingRefund}
                        >
                          {isProcessingRefund ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            'Refund'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Create Ticket Type</CardTitle>
                <CardDescription>
                  Add new ticket types with pricing and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-name">Ticket Name</Label>
                  <Input
                    id="ticket-name"
                    value={newTicketType.name}
                    onChange={(e) => setNewTicketType({ ...newTicketType, name: e.target.value })}
                    placeholder="General Admission"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-price">Price ($)</Label>
                  <Input
                    id="ticket-price"
                    type="number"
                    step="0.01"
                    value={newTicketType.price}
                    onChange={(e) => setNewTicketType({ ...newTicketType, price: e.target.value })}
                    placeholder="149.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-quantity">Available Quantity</Label>
                  <Input
                    id="ticket-quantity"
                    type="number"
                    value={newTicketType.availableQuantity}
                    onChange={(e) => setNewTicketType({ ...newTicketType, availableQuantity: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-description">Description</Label>
                  <Input
                    id="ticket-description"
                    value={newTicketType.description}
                    onChange={(e) => setNewTicketType({ ...newTicketType, description: e.target.value })}
                    placeholder="Access to all sessions..."
                  />
                </div>
                <Button onClick={handleCreateTicketType} className="w-full">
                  Create Ticket Type
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Types</CardTitle>
                <CardDescription>
                  Manage your event ticket types and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{ticket.name}</div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{ticket.description}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold">${ticket.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.soldQuantity}/{ticket.availableQuantity} sold
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button
                          size="sm"
                          onClick={() => initiateStripeCheckout(ticket.id)}
                          className="w-full"
                        >
                          <CreditCard className="mr-2 h-3 w-3" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Breakdown of payment methods used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Credit Cards', percentage: 75, amount: 34260 },
                    { method: 'PayPal', percentage: 20, amount: 9136 },
                    { method: 'Bank Transfer', percentage: 5, amount: 2284 }
                  ].map((method) => (
                    <div key={method.method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{method.method}</div>
                        <Badge variant="secondary">{method.percentage}%</Badge>
                      </div>
                      <div className="font-medium">${method.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Ticket Type</CardTitle>
                <CardDescription>
                  Performance breakdown by ticket category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between">
                      <div className="font-medium">{ticket.name}</div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${(ticket.price * ticket.soldQuantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.soldQuantity} sold
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
              <CardDescription>
                Configure your payment processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">Not connected</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Currency Settings</h4>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Transaction Fees</h4>
                <div className="text-sm text-muted-foreground">
                  Current rate: 2.9% + $0.30 per transaction
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};