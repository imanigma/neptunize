import { BookmarkIcon, MicIcon, SearchIcon, MoreHorizontalIcon, HomeIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

interface SearchProps {
  onNavigate: (screen: string) => void;
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Container */}
        <div className="flex flex-col h-[844px] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-medium text-gray-800">Search</h1>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </header>

          {/* Search Input */}
          <div className="p-4 bg-white border-b border-gray-100">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-gray-300 rounded-lg text-base placeholder:text-gray-400"
                placeholder="Search podcasts, creators, topics..."
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Trending Now Section */}
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Trending Now</h2>
              <div className="space-y-3">
                {trendingPodcasts.map((podcast, index) => (
                  <Card key={index} className="bg-gray-50 rounded-lg p-3 border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                        <MicIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-base">{podcast.title}</h3>
                        <p className="text-sm text-gray-600">{podcast.category} • {podcast.plays}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontalIcon className="w-3 h-4 text-gray-600" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Browse Categories Section */}
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Browse Categories</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <Card key={index} className="bg-gray-100 rounded-lg p-4 border-0 h-20 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <span className="text-base font-medium text-gray-800">{category.name}</span>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Creators Section */}
            <div className="p-4 pb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Popular Creators</h2>
              <div className="space-y-3">
                {creators.map((creator, index) => (
                  <Card key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-base">{creator.name}</h3>
                        <p className="text-sm text-gray-600">{creator.stats}</p>
                      </div>
                      <Button
                        variant={creator.following ? "outline" : "default"}
                        size="sm"
                        className={`px-4 py-2 text-sm ${
                          creator.following 
                            ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                            : "bg-gray-800 text-white hover:bg-gray-700"
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
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.screen)}
                  className="flex flex-col items-center justify-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`mb-1 ${item.active ? "text-black" : "text-gray-400"}`}>
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs ${item.active ? "text-black font-medium" : "text-gray-400"}`}
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