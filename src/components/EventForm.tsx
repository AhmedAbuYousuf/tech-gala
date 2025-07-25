import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Users, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  price: number;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }>;
  customFields: Array<{
    id: string;
    label: string;
    type: 'text' | 'select' | 'checkbox';
    options?: string[];
    required: boolean;
  }>;
  image?: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const eventCategories = [
  "Conference", "Concert", "Wedding", "Workshop", "Networking", 
  "Seminar", "Festival", "Sports", "Exhibition", "Meetup"
];

export const EventForm = ({ initialData, onSubmit, onCancel, isEditing = false }: EventFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    maxAttendees: initialData?.maxAttendees || 100,
    price: initialData?.price || 0,
    ticketTypes: initialData?.ticketTypes || [{
      id: "general",
      name: "General Admission",
      price: 0,
      quantity: 100,
      description: "Standard entry ticket"
    }],
    customFields: initialData?.customFields || [],
    image: initialData?.image || ""
  });

  const [newCustomField, setNewCustomField] = useState<{
    label: string;
    type: 'text' | 'select' | 'checkbox';
    required: boolean;
  }>({
    label: "",
    type: "text",
    required: false
  });

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTicketType = () => {
    const newTicket = {
      id: `ticket-${Date.now()}`,
      name: "New Ticket Type",
      price: 0,
      quantity: 50,
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicket]
    }));
  };

  const removeTicketType = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== id)
    }));
  };

  const updateTicketType = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map(ticket =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addCustomField = () => {
    if (!newCustomField.label.trim()) return;
    
    const field = {
      id: `field-${Date.now()}`,
      label: newCustomField.label,
      type: newCustomField.type,
      required: newCustomField.required,
      options: newCustomField.type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    
    setFormData(prev => ({
      ...prev,
      customFields: [...prev.customFields, field]
    }));
    
    setNewCustomField({ label: "", type: "text", required: false });
  };

  const removeCustomField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date || !formData.time || !formData.location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: isEditing ? "Event Updated" : "Event Created",
      description: `Your event "${formData.title}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your event title"
                className="border-border focus:border-primary"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your event..."
                rows={3}
                className="border-border focus:border-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange("maxAttendees", parseInt(e.target.value) || 0)}
                className="border-border focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date, Time & Location */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Date, Time & Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="border-border focus:border-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="border-border focus:border-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Event venue or address"
                className="border-border focus:border-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Types */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Ticket Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ticketTypes.map((ticket, index) => (
            <div key={ticket.id} className="p-4 border border-border rounded-lg bg-background/50">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">{`Ticket ${index + 1}`}</Badge>
                {formData.ticketTypes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTicketType(ticket.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Ticket name"
                  value={ticket.name}
                  onChange={(e) => updateTicketType(ticket.id, "name", e.target.value)}
                  className="border-border focus:border-primary"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) => updateTicketType(ticket.id, "price", parseFloat(e.target.value) || 0)}
                  className="border-border focus:border-primary"
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={ticket.quantity}
                  onChange={(e) => updateTicketType(ticket.id, "quantity", parseInt(e.target.value) || 0)}
                  className="border-border focus:border-primary"
                />
                <Input
                  placeholder="Description"
                  value={ticket.description}
                  onChange={(e) => updateTicketType(ticket.id, "description", e.target.value)}
                  className="border-border focus:border-primary"
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addTicketType}
            className="w-full"
          >
            Add Ticket Type
          </Button>
        </CardContent>
      </Card>

      {/* Custom Fields */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Custom Registration Fields
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.customFields.map((field) => (
            <div key={field.id} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-background/50">
              <Badge variant="secondary">{field.type}</Badge>
              <span className="flex-1">{field.label}</span>
              {field.required && <Badge variant="outline">Required</Badge>}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Field label"
              value={newCustomField.label}
              onChange={(e) => setNewCustomField(prev => ({ ...prev, label: e.target.value }))}
              className="border-border focus:border-primary"
            />
            <Select 
              value={newCustomField.type} 
              onValueChange={(value: "text" | "select" | "checkbox") => 
                setNewCustomField(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewCustomField(prev => ({ ...prev, required: !prev.required }))}
              className={newCustomField.required ? "bg-primary/10" : ""}
            >
              {newCustomField.required ? "Required" : "Optional"}
            </Button>
            <Button type="button" onClick={addCustomField}>
              Add Field
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
};