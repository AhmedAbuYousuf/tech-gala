import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Receipt,
  DollarSign,
  FileText,
  Calculator,
  Download,
  Send,
  Eye,
  Plus,
  Calendar,
  User,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoicingDashboardProps {
  onClose: () => void;
}

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-2024-001",
    eventId: "1",
    eventName: "Tech Conference 2024",
    clientName: "TechCorp Inc.",
    clientEmail: "billing@techcorp.com",
    amount: 36400,
    taxAmount: 2912,
    totalAmount: 39312,
    status: "paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    paidDate: "2024-01-20",
    currency: "USD",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-2024-002",
    eventId: "2",
    eventName: "Summer Music Festival",
    clientName: "Festival Productions LLC",
    clientEmail: "finance@festivalproductions.com",
    amount: 102000,
    taxAmount: 8160,
    totalAmount: 110160,
    status: "pending",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    paidDate: null,
    currency: "USD",
    paymentMethod: null
  },
  {
    id: "INV-2024-003",
    eventId: "4",
    eventName: "Business Summit",
    clientName: "Summit Events Co.",
    clientEmail: "accounts@summitevents.com",
    amount: 28000,
    taxAmount: 2240,
    totalAmount: 30240,
    status: "overdue",
    issueDate: "2023-12-15",
    dueDate: "2024-01-15",
    paidDate: null,
    currency: "USD",
    paymentMethod: null
  }
];

const mockTaxRates = [
  { region: "California", rate: 8.5, type: "Sales Tax" },
  { region: "New York", rate: 8.0, type: "Sales Tax" },
  { region: "Texas", rate: 6.25, type: "Sales Tax" },
  { region: "Florida", rate: 6.0, type: "Sales Tax" },
  { region: "International", rate: 0, type: "VAT" }
];

const mockFinancialSummary = {
  totalRevenue: 166400,
  totalTaxes: 13312,
  totalOutstanding: 140400,
  invoicesCount: 23,
  paidInvoices: 8,
  pendingInvoices: 12,
  overdueInvoices: 3
};

export const InvoicingDashboard = ({ onClose }: InvoicingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-success border-success/20 bg-success/10";
      case "pending": return "text-warning border-warning/20 bg-warning/10";
      case "overdue": return "text-destructive border-destructive/20 bg-destructive/10";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "overdue": return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateInvoice = () => {
    toast({
      title: "Invoice Generated",
      description: "Invoice has been successfully generated and saved.",
    });
    setIsCreateInvoiceOpen(false);
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoiceId} has been sent to the client.`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId} as PDF.`,
    });
  };

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
            <h1 className="text-3xl font-bold text-foreground">Invoicing & Tax Tools</h1>
            <p className="text-muted-foreground">Manage invoices, track payments, and handle tax calculations</p>
          </div>
        </div>
        <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <CreateInvoiceForm onSubmit={handleGenerateInvoice} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${mockFinancialSummary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {mockFinancialSummary.invoicesCount} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">${mockFinancialSummary.totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockFinancialSummary.pendingInvoices + mockFinancialSummary.overdueInvoices} unpaid invoices
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${mockFinancialSummary.totalTaxes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all invoices
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {Math.round((mockFinancialSummary.paidInvoices / mockFinancialSummary.invoicesCount) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {mockFinancialSummary.paidInvoices} of {mockFinancialSummary.invoicesCount} paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Invoices</TabsTrigger>
          <TabsTrigger value="tax-settings">Tax Settings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="shadow-card border-0 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{invoice.id}</span>
                          <Badge variant="outline" className={getStatusColor(invoice.status)}>
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1 capitalize">{invoice.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.eventName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold text-accent text-lg">
                          ${invoice.totalAmount.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInvoice(invoice)}
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {invoice.status !== "paid" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendInvoice(invoice.id)}
                            title="Send Reminder"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Client:</span>
                      <span>{invoice.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Issued:</span>
                      <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Amount:</span>
                      <span>${invoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Tax:</span>
                      <span>${invoice.taxAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tax-settings" className="space-y-6">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Tax Rate Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTaxRates.map((tax, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{tax.region}</span>
                      <p className="text-sm text-muted-foreground">{tax.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-accent">{tax.rate}%</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Tax Rate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle>Revenue Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download Monthly Revenue Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download Quarterly Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download Annual Report
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download Tax Summary
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download Sales Tax Report
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Download 1099 Forms
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input id="invoice-prefix" defaultValue="INV-2024-" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Default Payment Terms (Days)</Label>
                  <Input id="payment-terms" type="number" defaultValue="30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-footer">Invoice Footer Message</Label>
                <Textarea
                  id="invoice-footer"
                  defaultValue="Thank you for your business! Payment is due within 30 days."
                  rows={3}
                />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Details - {selectedInvoice.id}</DialogTitle>
            </DialogHeader>
            <InvoiceDetails invoice={selectedInvoice} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Create Invoice Form Component
const CreateInvoiceForm = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event">Event</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tech Conference 2024</SelectItem>
              <SelectItem value="2">Summer Music Festival</SelectItem>
              <SelectItem value="3">Web Development Workshop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input id="client" placeholder="Enter client name" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client-email">Client Email</Label>
        <Input id="client-email" type="email" placeholder="Enter client email" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
          <Input id="tax-rate" type="number" placeholder="8.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Input id="due-date" type="date" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Invoice description..." rows={3} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Generate Invoice</Button>
      </div>
    </form>
  );
};

// Invoice Details Component
const InvoiceDetails = ({ invoice }: { invoice: any }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{invoice.id}</h3>
          <p className="text-muted-foreground">{invoice.eventName}</p>
        </div>
        <Badge variant="outline" className={`${invoice.status === 'paid' ? 'text-success border-success/20 bg-success/10' : 
          invoice.status === 'pending' ? 'text-warning border-warning/20 bg-warning/10' : 
          'text-destructive border-destructive/20 bg-destructive/10'}`}>
          {invoice.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <p>{invoice.clientName}</p>
          <p className="text-muted-foreground">{invoice.clientEmail}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Invoice Details:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Issue Date:</span>
              <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Due Date:</span>
              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            {invoice.paidDate && (
              <div className="flex justify-between">
                <span>Paid Date:</span>
                <span>{new Date(invoice.paidDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${invoice.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${invoice.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-accent">${invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        {invoice.status !== "paid" && (
          <Button className="gap-2">
            <Send className="w-4 h-4" />
            Send Reminder
          </Button>
        )}
      </div>
    </div>
  );
};