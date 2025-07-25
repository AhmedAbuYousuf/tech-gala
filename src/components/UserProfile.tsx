import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  Heart,
  Settings,
  Edit,
  Save,
  UserPlus,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  interests: string[];
  following: string[];
  eventsAttended: number;
  pointsEarned: number;
  badges: string[];
}

const mockUserProfile: UserProfileData = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  bio: "Tech enthusiast and event lover. Always looking for new experiences and learning opportunities.",
  location: "San Francisco, CA",
  interests: ["Technology", "Music", "Networking", "Workshops", "Conferences"],
  following: ["tech-organizer", "music-events", "workshop-pro"],
  eventsAttended: 23,
  pointsEarned: 1250,
  badges: ["Early Bird", "Social Butterfly", "Tech Explorer", "Networking Pro"]
};

const mockFollowingOrganizers = [
  { id: "tech-organizer", name: "Tech Events Co", events: 45, followers: 1200 },
  { id: "music-events", name: "Music Nights", events: 28, followers: 850 },
  { id: "workshop-pro", name: "Learning Hub", events: 67, followers: 2100 }
];

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const [profile, setProfile] = useState<UserProfileData>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfileData>(mockUserProfile);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
  };

  const handleUnfollow = (organizerId: string) => {
    setProfile(prev => ({
      ...prev,
      following: prev.following.filter(id => id !== organizerId)
    }));
    toast({
      title: "Unfollowed",
      description: "You've unfollowed this organizer",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">User Profile</h2>
        <Button variant="ghost" onClick={onClose}>
          Close Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setTempProfile(profile);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveProfile}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="text-xl font-bold"
                    />
                  ) : (
                    <h3 className="text-xl font-bold">{profile.name}</h3>
                  )}
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Bio</label>
                {isEditing ? (
                  <Textarea
                    value={tempProfile.bio}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.bio}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                {isEditing ? (
                  <Input
                    value={tempProfile.location}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.location}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Following Organizers */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Following Organizers ({profile.following.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFollowingOrganizers.map(organizer => (
                  <div 
                    key={organizer.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{organizer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {organizer.events} events • {organizer.followers} followers
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnfollow(organizer.id)}
                    >
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.eventsAttended}</div>
                <div className="text-sm text-muted-foreground">Events Attended</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{profile.pointsEarned}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-success">{profile.following.length}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="shadow-card border-0 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {profile.badges.map(badge => (
                  <div 
                    key={badge}
                    className="text-center p-3 rounded-lg bg-primary/10"
                  >
                    <Award className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="text-xs font-medium">{badge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};