import { BookmarkIcon, MicIcon, SearchIcon, MoreHorizontalIcon, HomeIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

interface SearchProps {
  onNavigate: (screen: string, podcastData?: any) => void;
}

export const Search = ({ onNavigate }: SearchProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation items data
  const navItems = [
    {
      icon: <HomeIcon className="w-5 h-5" />,
      label: "Home",
      active: false,
      screen: "home",
    },
    {
      icon: <MicIcon className="w-3.5 h-5" />,
      label: "Generate",
      active: false,
      screen: "generate",
    },
    {
      icon: <SearchIcon className="w-5 h-5" />,
      label: "Search",
      active: true,
      screen: "search",
    },
    {
      icon: <BookmarkIcon className="w-[15px] h-5" />,
      label: "Library",
      active: false,
      screen: "library",
    },
  ];

  // Trending podcasts data
  const trendingPodcasts = [
    {
      title: "Tech Talk Weekly",
      category: "Technology",
      plays: "2.4M plays",
    },
    {
      title: "Business Insights",
      category: "Business",
      plays: "1.8M plays",
    },
    {
      title: "Health & Wellness",
      category: "Health",
      plays: "1.2M plays",
    },
  ];

  const handlePodcastClick = (podcast: any) => {
    const podcastData = {
      title: podcast.title,
      podcast: podcast.category,
      episode: `Episode 1 • ${Math.floor(Math.random() * 60) + 20} min`,
      duration: `${Math.floor(Math.random() * 30) + 30}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      currentTime: `${Math.floor(Math.random() * 15) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      progress: Math.floor(Math.random() * 80) + 10,
    };
    onNavigate("player", podcastData);
  };

  // Categories data
  const categories = [
    { name: "Technology", icon: "💻" },
    { name: "Business", icon: "💼" },
    { name: "Health", icon: "🏥" },
    { name: "Education", icon: "📚" },
  ];

  // Popular creators data
  const creators = [
    {
      name: "Sarah Johnson",
      stats: "12 podcasts • 890K followers",
      following: false,
    },
    {
      name: "Mike Chen",
      stats: "8 podcasts • 654K followers",
      following: true,
    },
  ];

  // Podcasts from your network (followers/following)
  const networkPodcasts = [
    {
      title: "Morning Motivation",
      creator: "Alex Thompson",
      relationship: "following",
      timeAgo: "2 hours ago",
      duration: "15 min",
      listens: "1.2K",
    },
    {
      title: "Design Thinking 101",
      creator: "Sarah Chen",
      relationship: "follower",
      timeAgo: "5 hours ago", 
      duration: "32 min",
      listens: "856",
    },
    {
      title: "Startup Journey",
      creator: "Mike Rodriguez",
      relationship: "following",
      timeAgo: "1 day ago",
      duration: "28 min", 
      listens: "2.1K",
    },
    {
      title: "Mindful Moments",
      creator: "Emma Wilson",
      relationship: "mutual",
      timeAgo: "2 days ago",
      duration: "18 min",
      listens: "743",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-gray-900 to-black min-h-screen">
        {/* Mobile Container */}
        <div className="flex flex-col min-h-screen relative">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Search</h1>
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-800/50">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
            </Button>
          </header>

          {/* Search Input */}
          <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-800/50 border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/30"
                placeholder="Search podcasts, creators, topics..."
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
            {/* Trending Now Section */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Trending Now</h2>
              <div className="space-y-3">
                {trendingPodcasts.map((podcast, index) => (
                  <Card 
                    key={index} 
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-3 cursor-pointer hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-200 transform hover:scale-[1.02]"
                    onClick={() => handlePodcastClick(podcast)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <MicIcon className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-base">{podcast.title}</h3>
                        <p className="text-sm text-gray-400">{podcast.category} • {podcast.plays}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-700/50">
                        <MoreHorizontalIcon className="w-3 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Browse Categories Section */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Browse Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <Card key={index} className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-700 rounded-xl p-4 h-20 flex flex-col items-center justify-center cursor-pointer hover:from-gray-700/40 hover:to-gray-800/40 transition-all duration-200 transform hover:scale-105">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <span className="text-base font-medium text-white">{category.name}</span>
                  </Card>
                ))}
              </div>
            </div>

            {/* Podcasts from Your Network Section */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4">From Your Network</h2>
              <div className="space-y-3">
                {networkPodcasts.map((podcast, index) => (
                  <Card 
                    key={index} 
                    className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-3 cursor-pointer hover:from-gray-700/30 hover:to-gray-800/30 transition-all duration-200 transform hover:scale-[1.01]"
                    onClick={() => handlePodcastClick(podcast)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <MicIcon className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-base">{podcast.title}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm text-gray-400">by {podcast.creator}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-green-400/20 to-blue-500/20 text-green-400 border border-green-400/30">
                            {podcast.relationship === "following" ? "Following" : 
                             podcast.relationship === "follower" ? "Follower" : "Mutual"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{podcast.timeAgo}</span>
                          <span>•</span>
                          <span>{podcast.duration}</span>
                          <span>•</span>
                          <span>{podcast.listens} listens</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-700/50">
                        <MoreHorizontalIcon className="w-3 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Creators Section */}
            <div className="p-4 pb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Popular Creators</h2>
              <div className="space-y-3">
                {creators.map((creator, index) => (
                  <Card key={index} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-black text-sm font-semibold">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-base">{creator.name}</h3>
                        <p className="text-sm text-gray-400">{creator.stats}</p>
                      </div>
                      <Button
                        variant={creator.following ? "outline" : "default"}
                        size="sm"
                        className={`px-4 py-2 text-sm transition-all duration-200 ${
                          creator.following 
                            ? "border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white" 
                            : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-medium"
                        }`}
                      >
                        {creator.following ? "Following" : "Follow"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-black/70 backdrop-blur-lg border-t border-gray-800 px-4 py-2 safe-area-bottom">
            <div className="flex justify-around items-center">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.screen)}
                  className="flex flex-col items-center justify-center py-3 px-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200"
                >
                  <div className={`mb-1 transition-all duration-200 ${
                    item.active 
                      ? "text-green-400 transform scale-110" 
                      : "text-gray-400 hover:text-gray-300"
                  }`}>
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs transition-all duration-200 ${
                      item.active 
                        ? "text-green-400 font-semibold" 
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};