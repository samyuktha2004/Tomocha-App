import { ArrowLeft, Heart, Share2, Bookmark, Play, User, Phone, CheckCircle, Clock, UserPlus, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgImage from "figma:asset/1cac81d18c1c3bda9b305da852ec8356b49fee87.png";
import imgImage1 from "figma:asset/d18b8aa2ef99b9e650e51b5fc0ca03224992239d.png";
import imgImage2 from "figma:asset/52378fcb7ed49053565507c9757ec4d5334aad43.png";
import imgImage3 from "figma:asset/0e5a1b1294b31ec349821d8dceaec2a24c3a2eb7.png";
import imgImage4 from "figma:asset/86f0180a0eb648d2af06b081d7ad47cdd3960635.png";
import BottomNav from "./BottomNav";
import ChatbotSelector from "./ChatbotSelector";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Group from "../imports/Group2.tsx";

interface FanClubPageProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  type: 'video' | 'quote';
  content: string;
  thumbnail?: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface SupportContact {
  id: number;
  name: string;
  emoji: string;
  status: 'active' | 'pending';
  gradient: string;
}

export default function FanClubPage({ onBack, onNavigate }: FanClubPageProps) {
  const { theme } = useTheme();
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmoji, setNewContactEmoji] = useState("👤");
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  
  // Load profile avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profileAvatar');
    if (savedAvatar) {
      setProfileAvatar(savedAvatar);
    }
  }, []);
  
  const [supportContacts, setSupportContacts] = useState<SupportContact[]>([
    { id: 1, name: "Mom", emoji: "👩", status: "active", gradient: "from-purple-400 to-pink-400" },
    { id: 2, name: "Best Friend Sarah", emoji: "👤", status: "active", gradient: "from-blue-400 to-indigo-400" },
    { id: 3, name: "Brother Alex", emoji: "👨", status: "pending", gradient: "from-amber-400 to-orange-400" }
  ]);
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Tony Robbins",
      avatar: imgImage3,
      type: "video",
      content: "Discover Your True Self - Powerful motivation on embracing who you are and unlocking your potential.",
      thumbnail: imgImage4,
      likes: 1247,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      author: "Deepika Padukone",
      avatar: imgImage,
      type: "quote",
      content: "Mental health is just as important as physical health. Don't be afraid to speak up and seek help when you need it. You are not alone. 💜",
      likes: 2841,
      isLiked: true,
      isSaved: false
    },
    {
      id: 3,
      author: "Shah Rukh Khan",
      avatar: imgImage1,
      type: "quote",
      content: "Success is not just about what you accomplish, but about what you inspire others to do. Stay positive, stay strong.",
      likes: 1923,
      isLiked: false,
      isSaved: true
    },
    {
      id: 4,
      author: "Selena Gomez",
      avatar: imgImage2,
      type: "quote",
      content: "Your mind is powerful. When you fill it with positive thoughts, your life will start to change. Take time for yourself today. 🌸",
      likes: 3104,
      isLiked: false,
      isSaved: false
    }
  ]);

  const influencers = [
    { name: "Deepika Padukone", image: imgImage },
    { name: "Tony Robbins", image: imgImage3 },
    { name: "Shah Rukh Khan", image: imgImage1 },
    { name: "Selena Gomez", image: imgImage2 }
  ];

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleChatbotSelect = (chatbot: string) => {
    setShowChatbotSelector(false);
    onNavigate(chatbot);
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) {
      toast.error("Please enter a contact name");
      return;
    }
    
    const gradients = [
      "from-purple-400 to-pink-400",
      "from-blue-400 to-indigo-400",
      "from-green-400 to-emerald-400",
      "from-orange-400 to-red-400",
      "from-teal-400 to-cyan-400",
      "from-pink-400 to-rose-400"
    ];
    
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    const newContact: SupportContact = {
      id: Date.now(),
      name: newContactName.trim(),
      emoji: newContactEmoji,
      status: "pending",
      gradient: randomGradient
    };
    
    setSupportContacts([...supportContacts, newContact]);
    setNewContactName("");
    setNewContactEmoji("👤");
    setShowAddContactDialog(false);
    
    toast.success("Contact added!", {
      description: `${newContactName} has been added to your support circle`
    });
  };

  const handleRemoveContact = (id: number) => {
    const contact = supportContacts.find(c => c.id === id);
    setSupportContacts(supportContacts.filter(c => c.id !== id));
    toast.success(`${contact?.name} removed from support circle`);
  };

  const handleShare = (post: Post) => {
    toast.success("Link copied!", {
      description: `Share this ${post.type} by ${post.author}`
    });
  };

  const handleExploreMore = () => {
    toast("Coming soon!", {
      description: "We're adding more inspiring content every day"
    });
  };

  const handleLoadMore = () => {
    toast("Loading more posts...", {
      description: "Fresh content coming your way"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-[#1a1625] dark:to-[#231d2e] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 py-4 pt-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-purple-900 dark:text-purple-200">Your Fanclub!</h2>
            <p className="text-purple-700 dark:text-purple-300 mt-1">
              Your Library of Mental Health Advocates, Influencers and Celebrity Speakers
            </p>
          </div>
          <button onClick={() => onNavigate('account')} className="cursor-pointer">
            <Avatar className="w-10 h-10 border-2 border-purple-300 dark:border-purple-600">
              <AvatarImage src={profileAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-500">
                <div className="w-6 h-6">
                  <Group />
                </div>
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Influencers Carousel */}
      <div className="px-6 py-6">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {influencers.map((influencer, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className="w-24 h-24 rounded-full border-4 border-purple-400 dark:border-purple-500 overflow-hidden bg-white dark:bg-gray-800">
                <img 
                  src={influencer.image} 
                  alt={influencer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-purple-900 dark:text-purple-200 text-center">{influencer.name}</p>
            </div>
          ))}
          <button 
            onClick={handleExploreMore}
            className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-80 transition-opacity"
          >
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-300 dark:border-purple-600 flex items-center justify-center bg-purple-50 dark:bg-purple-950/30">
              <span className="text-purple-400 dark:text-purple-400">+</span>
            </div>
            <p className="text-purple-600 dark:text-purple-400 text-center">Explore More</p>
          </button>
        </div>
      </div>

      {/* Featured Quote of the Day */}
      <div className="px-6 mb-6">
        <h3 className="text-purple-900 dark:text-purple-200 mb-4">Featured Quote of the Day</h3>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-pink-950/40 rounded-2xl p-6 border-2 border-purple-300 dark:border-purple-700">
          <p className="text-purple-900 dark:text-purple-200 text-center italic">
            "Take time to do what makes your soul happy."
          </p>
        </div>
      </div>

      {/* SOS Support Circle Card */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-2xl p-6 border-2 border-teal-300 dark:border-teal-700 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-teal-900 dark:text-teal-200 flex-1">Your SOS Support Circle</h3>
          </div>
          
          <p className="text-teal-700 dark:text-teal-300 mb-4">
            These trusted contacts will be notified when you send an SOS alert
          </p>

          {/* Support Contacts List */}
          <div className="space-y-3">
            {supportContacts.map((contact) => (
              <div 
                key={contact.id}
                className={`bg-white dark:bg-gray-800/50 rounded-xl p-4 border-2 border-teal-200 dark:border-teal-800 flex items-center gap-3 ${contact.status === 'pending' ? 'opacity-75' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.gradient} flex items-center justify-center shadow-sm`}>
                  <span className="text-white">{contact.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-teal-900 dark:text-teal-200">{contact.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    {contact.status === 'active' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500 fill-green-500" />
                        <span className="text-green-700 dark:text-green-400">Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-400">Pending Consent</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Contact Button */}
          <button 
            onClick={() => setShowAddContactDialog(true)}
            className="w-full mt-4 border-2 border-dashed border-teal-300 dark:border-teal-700 rounded-xl py-3 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/30 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Another Contact
          </button>
        </div>
      </div>

      {/* Feed Header */}
      <div className="px-6 mb-4">
        <h3 className="text-purple-900 dark:text-purple-200">Your Favourite Talks!</h3>
      </div>

      {/* Posts Feed */}
      <div className="px-6 space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-300 dark:border-purple-600">
                <img 
                  src={post.avatar} 
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-purple-900 dark:text-purple-200">{post.author}</h4>
                <p className="text-purple-500 dark:text-purple-400">2h ago</p>
              </div>
            </div>

            {/* Post Content */}
            {post.type === 'video' && post.thumbnail && (
              <div className="relative">
                <img 
                  src={post.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-purple-600 ml-1" />
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <p className="text-purple-900 dark:text-purple-200 mb-4">{post.content}</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${post.isLiked ? 'fill-pink-500 text-pink-500' : ''}`} 
                  />
                  <span className={post.isLiked ? 'text-pink-500' : ''}>{post.likes}</span>
                </button>

                <button 
                  onClick={() => toggleSave(post.id)}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Bookmark 
                    className={`w-6 h-6 ${post.isSaved ? 'fill-purple-600 dark:fill-purple-400' : ''}`}
                  />
                </button>

                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="px-6 py-6 text-center">
        <Button 
          variant="outline" 
          onClick={handleLoadMore}
          className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/30"
        >
          Explore More
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentPage="fanclub"
        onNavigate={onNavigate}
        onChatClick={() => setShowChatbotSelector(true)}
      />

      {/* Chatbot Selector Modal */}
      {showChatbotSelector && (
        <ChatbotSelector 
          onSelect={handleChatbotSelect}
          onClose={() => setShowChatbotSelector(false)}
        />
      )}

      {/* Add Contact Dialog */}
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/90 dark:to-cyan-950/90 border-2 border-teal-300 dark:border-teal-700">
          <DialogHeader>
            <DialogTitle className="text-teal-900 dark:text-teal-200 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Add Support Contact
            </DialogTitle>
            <DialogDescription className="text-teal-700 dark:text-teal-300">
              Add a trusted person to your SOS support circle. They'll be notified when you need help.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-teal-900 dark:text-teal-200">
                Contact Name
              </Label>
              <Input
                id="contactName"
                placeholder="e.g., Mom, Best Friend, Therapist"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="bg-white dark:bg-gray-800/50 border-teal-300 dark:border-teal-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmoji" className="text-teal-900 dark:text-teal-200">
                Choose an Emoji
              </Label>
              <div className="flex gap-2 flex-wrap">
                {["👩", "👨", "👤", "👧", "👦", "🧑", "👴", "👵", "💜", "❤️", "🌟", "🦋"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewContactEmoji(emoji)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      newContactEmoji === emoji
                        ? "border-teal-500 bg-teal-100 dark:bg-teal-900/50 scale-110"
                        : "border-teal-300 dark:border-teal-700 bg-white dark:bg-gray-800/50 hover:scale-105"
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddContactDialog(false);
                setNewContactName("");
                setNewContactEmoji("👤");
              }}
              className="border-teal-300 dark:border-teal-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}