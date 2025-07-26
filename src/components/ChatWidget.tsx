import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Phone, 
  Mail,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  isRead?: boolean;
}

interface ChatWidgetProps {
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can we help you today?',
      sender: 'bot',
      timestamp: new Date(),
      isRead: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [supportStatus, setSupportStatus] = useState<'online' | 'away' | 'offline'>('online');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const addMessage = (content: string, sender: 'user' | 'support' | 'bot') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      isRead: isOpen
    };
    
    setMessages(prev => [...prev, message]);
    
    if (!isOpen && sender !== 'user') {
      setUnreadCount(prev => prev + 1);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addMessage(newMessage, 'user');
    setNewMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate auto-response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thanks for reaching out! A support agent will be with you shortly.",
        "I understand your concern. Let me check that for you.",
        "That's a great question! Here's what I can help you with...",
        "Let me connect you with our technical support team.",
        "I'll escalate this to our events specialist right away."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'support');
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Event Help', action: () => addMessage('I need help with an event', 'user') },
    { label: 'Technical Issue', action: () => addMessage('I\'m experiencing a technical issue', 'user') },
    { label: 'Billing Question', action: () => addMessage('I have a billing question', 'user') },
    { label: 'Feature Request', action: () => addMessage('I\'d like to request a new feature', 'user') }
  ];

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'support':
        return <MessageCircle className="w-4 h-4" />;
      case 'bot':
        return <Bot className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-primary text-primary-foreground';
      case 'support':
        return 'bg-secondary text-secondary-foreground';
      case 'bot':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-6 right-6 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-elegant hover:shadow-glow transition-all duration-300"
          variant="hero"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <div className={cn(
        "bg-background border border-border rounded-lg shadow-elegant transition-all duration-300",
        isMinimized ? "w-80 h-14" : "w-80 h-96"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <MessageCircle className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                supportStatus === 'online' ? 'bg-success' : 
                supportStatus === 'away' ? 'bg-warning' : 'bg-destructive'
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Event Support</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {supportStatus === 'online' ? 'Online now' : 
                 supportStatus === 'away' ? 'Away' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="h-64 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender !== 'user' && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className={getSenderColor(message.sender)}>
                          {getSenderIcon(message.sender)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-6 w-6 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <MessageCircle className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick help:</p>
                <div className="flex flex-wrap gap-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Contact Options */}
              <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    toast({
                      title: "Call Support",
                      description: "Our support line: 1-800-EVENTS",
                    });
                  }}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    toast({
                      title: "Email Support",
                      description: "Send us an email: support@events.com",
                    });
                  }}
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};