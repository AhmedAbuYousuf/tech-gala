import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Save, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Seat {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: 'available' | 'reserved' | 'occupied' | 'blocked';
  ticketType: string;
  price: number;
  reservedBy?: string;
}

interface Section {
  id: string;
  name: string;
  color: string;
  seats: Seat[];
}

interface SeatingMapProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

// Mock seating data
const mockSections: Section[] = [
  {
    id: "1",
    name: "VIP Section",
    color: "#FFD700",
    seats: Array.from({ length: 20 }, (_, i) => ({
      id: `vip-${i + 1}`,
      row: "V",
      number: i + 1,
      x: 50 + (i % 10) * 40,
      y: 100,
      status: i < 5 ? 'reserved' : i < 15 ? 'available' : 'occupied',
      ticketType: "VIP",
      price: 299,
      reservedBy: i < 5 ? `Guest ${i + 1}` : undefined
    } as Seat))
  },
  {
    id: "2", 
    name: "Premium Section",
    color: "#FF6B6B",
    seats: Array.from({ length: 40 }, (_, i) => ({
      id: `premium-${i + 1}`,
      row: String.fromCharCode(65 + Math.floor(i / 10)),
      number: (i % 10) + 1,
      x: 50 + (i % 10) * 40,
      y: 150 + Math.floor(i / 10) * 30,
      status: i < 10 ? 'reserved' : i < 30 ? 'available' : 'occupied',
      ticketType: "Premium",
      price: 149,
      reservedBy: i < 10 ? `Guest ${i + 11}` : undefined
    } as Seat))
  },
  {
    id: "3",
    name: "General Admission",
    color: "#4ECDC4",
    seats: Array.from({ length: 80 }, (_, i) => ({
      id: `general-${i + 1}`,
      row: String.fromCharCode(69 + Math.floor(i / 20)),
      number: (i % 20) + 1,
      x: 30 + (i % 20) * 20,
      y: 300 + Math.floor(i / 20) * 25,
      status: i < 20 ? 'reserved' : i < 60 ? 'available' : 'occupied',
      ticketType: "General",
      price: 49,
      reservedBy: i < 20 ? `Guest ${i + 21}` : undefined
    } as Seat))
  }
];

export const SeatingMap = ({ eventId, eventTitle, onClose }: SeatingMapProps) => {
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('view');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const allSeats = sections.flatMap(section => section.seats);
  const stats = {
    total: allSeats.length,
    available: allSeats.filter(s => s.status === 'available').length,
    reserved: allSeats.filter(s => s.status === 'reserved').length,
    occupied: allSeats.filter(s => s.status === 'occupied').length,
    blocked: allSeats.filter(s => s.status === 'blocked').length
  };

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'available': return '#10B981';
      case 'reserved': return '#F59E0B';
      case 'occupied': return '#EF4444';
      case 'blocked': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  const handleSeatStatusChange = (seatId: string, newStatus: Seat['status']) => {
    setSections(prev => prev.map(section => ({
      ...section,
      seats: section.seats.map(seat => 
        seat.id === seatId 
          ? { ...seat, status: newStatus, reservedBy: newStatus === 'reserved' ? 'New Guest' : undefined }
          : seat
      )
    })));
    setSelectedSeat(null);
    toast.success("Seat status updated");
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode === 'view') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewMode === 'view') {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Seating Map</h2>
          <p className="text-muted-foreground">{eventTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'view' ? 'default' : 'outline'}
            onClick={() => setViewMode('view')}
            size="sm"
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button
            variant={viewMode === 'edit' ? 'default' : 'outline'}
            onClick={() => setViewMode('edit')}
            size="sm"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Seats</p>
                <p className="text-xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-bold text-success">{stats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Reserved</p>
                <p className="text-xl font-bold text-warning">{stats.reserved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-xl font-bold text-destructive">{stats.occupied}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-xl font-bold text-muted-foreground">{stats.blocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={handleZoomIn} size="sm" variant="outline" className="gap-2">
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </Button>
          <Button onClick={handleZoomOut} size="sm" variant="outline" className="gap-2">
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </Button>
          <Button onClick={handleResetView} size="sm" variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset View
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted-foreground"></div>
            <span>Blocked</span>
          </div>
        </div>
      </div>

      {/* Seating Map Canvas */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-0">
          <div 
            ref={canvasRef}
            className="relative h-96 overflow-hidden cursor-move bg-muted/10"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="absolute inset-0 origin-top-left transition-transform"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
              }}
            >
              {/* Stage */}
              <div 
                className="absolute bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold"
                style={{ left: 100, top: 20, width: 400, height: 40 }}
              >
                STAGE
              </div>

              {/* Sections and Seats */}
              {sections.map(section => (
                <div key={section.id}>
                  {/* Section Label */}
                  <div 
                    className="absolute text-sm font-semibold text-foreground"
                    style={{ 
                      left: section.seats[0]?.x - 20, 
                      top: section.seats[0]?.y - 25,
                      color: section.color 
                    }}
                  >
                    {section.name}
                  </div>
                  
                  {/* Seats */}
                  {section.seats.map(seat => (
                    <div
                      key={seat.id}
                      className="absolute w-6 h-6 rounded cursor-pointer border-2 border-background hover:scale-110 transition-transform flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        left: seat.x,
                        top: seat.y,
                        backgroundColor: getSeatColor(seat)
                      }}
                      onClick={() => handleSeatClick(seat)}
                      title={`${seat.row}${seat.number} - ${seat.status} - $${seat.price}`}
                    >
                      {seat.number}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Detail Dialog */}
      <Dialog open={!!selectedSeat} onOpenChange={() => setSelectedSeat(null)}>
        <DialogContent className="bg-gradient-card border-0">
          <DialogHeader>
            <DialogTitle>
              Seat {selectedSeat?.row}{selectedSeat?.number} Details
            </DialogTitle>
          </DialogHeader>
          {selectedSeat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Seat Location</Label>
                  <p className="text-lg font-semibold">
                    Row {selectedSeat.row}, Seat {selectedSeat.number}
                  </p>
                </div>
                <div>
                  <Label>Price</Label>
                  <p className="text-lg font-semibold text-accent">
                    ${selectedSeat.price}
                  </p>
                </div>
                <div>
                  <Label>Ticket Type</Label>
                  <p className="text-lg font-semibold">
                    {selectedSeat.ticketType}
                  </p>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <Badge className={`${getSeatColor(selectedSeat)} text-white border-0`}>
                    {selectedSeat.status}
                  </Badge>
                </div>
              </div>

              {selectedSeat.reservedBy && (
                <div>
                  <Label>Reserved By</Label>
                  <p className="text-lg font-semibold">
                    {selectedSeat.reservedBy}
                  </p>
                </div>
              )}

              {viewMode === 'edit' && (
                <div className="space-y-2">
                  <Label>Change Status</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedSeat.status === 'available' ? 'default' : 'outline'}
                      onClick={() => handleSeatStatusChange(selectedSeat.id, 'available')}
                      className="flex-1"
                    >
                      Available
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSeat.status === 'reserved' ? 'default' : 'outline'}
                      onClick={() => handleSeatStatusChange(selectedSeat.id, 'reserved')}
                      className="flex-1"
                    >
                      Reserved
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSeat.status === 'occupied' ? 'default' : 'outline'}
                      onClick={() => handleSeatStatusChange(selectedSeat.id, 'occupied')}
                      className="flex-1"
                    >
                      Occupied
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSeat.status === 'blocked' ? 'default' : 'outline'}
                      onClick={() => handleSeatStatusChange(selectedSeat.id, 'blocked')}
                      className="flex-1"
                    >
                      Blocked
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};