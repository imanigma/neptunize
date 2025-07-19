import { BookmarkIcon, MicIcon, SearchIcon, MoreHorizontalIcon, PauseIcon, HomeIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

interface LibraryProps {
  onNavigate: (screen: string, podcastData?: any) => void;
}

export const Library = ({ onNavigate }: LibraryProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState("downloaded");

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
      active: false,
      screen: "search",
    },
    {
      icon: <BookmarkIcon className="w-[15px] h-5" />,
      label: "Library",
      active: true,
      screen: "library",
    },
  ];

  // Downloaded Podcasts data
  const downloadedPodcasts = [
    {
      title: "The Tim Ferriss Show",
      subtitle: "Tim Ferriss • Downloaded 2 hours ago",
      size: "45.2 MB",
      progress: 100,
    },
    {
      title: "Radiolab",
      subtitle: "WNYC Studios • Downloaded yesterday",
      size: "32.8 MB", 
      progress: 100,
    },
    {
      title: "This American Life",
      subtitle: "This American Life • Downloaded 3 days ago",
      size: "58.1 MB",
      progress: 100,
    },
  ];

  // History data
  const historyPodcasts = [
    {
      title: "How to Build Wealth",
      subtitle: "The Investors Podcast • Played 2 hours ago",
      duration: "1h 15m",
      date: "Today",
    },
    {
      title: "The Science of Sleep",
      subtitle: "Huberman Lab • Played yesterday",
      duration: "2h 30m", 
      date: "Yesterday",
    },
    {
      title: "Startup Stories",
      subtitle: "How I Built This • Played 2 days ago",
      duration: "45m",
      date: "Dec 15",
    },
    {
      title: "AI and the Future",
      subtitle: "Lex Fridman Podcast • Played 3 days ago",
      duration: "3h 20m",
      date: "Dec 14",
    },
    {
      title: "Mindfulness Meditation",
      subtitle: "Ten Percent Happier • Played 1 week ago",
      duration: "25m",
      date: "Dec 10",
    },
  ];

  // My Podcasts data
  const myPodcasts = [
    {
      title: "Tech Talks Daily",
      subtitle: "Created by you • 12 episodes",
    },
    {
      title: "Morning Thoughts",
      subtitle: "Created by you • 8 episodes",
    },
  ];

  const handlePodcastClick = (podcast: any) => {
    const podcastData = {
      title: podcast.title,
      podcast: podcast.subtitle ? podcast.subtitle.split(' • ')[0] : "Unknown Podcast",
      episode: podcast.subtitle || "Episode 1 • 30 min",
      duration: `${Math.floor(Math.random() * 30) + 30}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      currentTime: `${Math.floor(Math.random() * 15) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      progress: podcast.progress || Math.floor(Math.random() * 80) + 10,
    };
    onNavigate("player", podcastData);
  };

  // Saved Podcasts data
  const savedPodcasts = [
    {
      title: "The Joe Rogan Experience",
      subtitle: "Joe Rogan • 2,145 episodes",
    },
    {
      title: "Serial",
      subtitle: "This American Life • 3 seasons",
    },
    {
      title: "How I Built This",
      subtitle: "NPR • 412 episodes",
    },
    {
      title: "Conan O'Brien Needs a Friend",
      subtitle: "Team Coco • 245 episodes",
    },
  ];

  // Recently Played data
  const recentlyPlayed = [
    {
      title: "The Future of AI",
      subtitle: "Tech Talks Daily • 45 min",
      progress: 75,
    },
    {
      title: "Building Better Habits",
      subtitle: "Morning Thoughts • 32 min",
      progress: 50,
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Container */}
        <div className="flex flex-col h-[844px] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-medium text-gray-800">Library</h1>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </header>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-white">
            {[
              { id: "downloaded", label: "Downloaded" },
              { id: "saved", label: "Saved" },
              { id: "history", label: "History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "downloaded" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Downloaded Episodes</h2>
                  <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto">
                    Manage
                  </Button>
                </div>
                <div className="space-y-3">
                  {downloadedPodcasts.map((podcast, index) => (
                    <Card 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handlePodcastClick(podcast)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                              {podcast.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-base">{podcast.title}</h3>
                          <p className="text-sm text-gray-600">{podcast.subtitle}</p>
                          <p className="text-xs text-gray-500">{podcast.size}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontalIcon className="w-3 h-4 text-gray-600" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Storage Info */}
                <Card className="bg-gray-50 rounded-lg p-4 border-0 mt-6">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 mb-1">Storage Used</h4>
                    <p className="text-sm text-gray-600 mb-3">136.1 MB of 2 GB used</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '6.8%' }}></div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-white">
                      Manage Storage
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "saved" && (
              <>
                {/* My Podcasts Section */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-800">My Podcasts</h2>
                    <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto">
                      See All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {myPodcasts.map((podcast, index) => (
                      <Card 
                        key={index} 
                        className="bg-gray-50 rounded-lg p-3 border-0 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handlePodcastClick(podcast)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                            <BookmarkIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-base">{podcast.title}</h3>
                            <p className="text-sm text-gray-600">{podcast.subtitle}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontalIcon className="w-3 h-4 text-gray-600" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Saved Podcasts Section */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Saved Podcasts</h2>
                    <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto">
                      See All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {savedPodcasts.map((podcast, index) => (
                      <Card 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handlePodcastClick(podcast)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                              {podcast.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-base">{podcast.title}</h3>
                            <p className="text-sm text-gray-600">{podcast.subtitle}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <BookmarkIcon className="w-4 h-4 text-gray-500" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recently Played Section */}
                <div className="p-4 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Recently Played</h2>
                    <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto">
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {recentlyPlayed.map((episode, index) => (
                      <Card 
                        key={index} 
                        className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handlePodcastClick(episode)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                              {episode.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-base">{episode.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{episode.subtitle}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-black h-1 rounded-full transition-all duration-300" 
                                style={{ width: `${episode.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontalIcon className="w-3 h-4 text-gray-600" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "history" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Listening History</h2>
                  <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto">
                    Clear All
                  </Button>
                </div>
                <div className="space-y-3">
                  {historyPodcasts.map((podcast, index) => (
                    <Card 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handlePodcastClick(podcast)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                            {podcast.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-base">{podcast.title}</h3>
                          <p className="text-sm text-gray-600">{podcast.subtitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{podcast.duration}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{podcast.date}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontalIcon className="w-3 h-4 text-gray-600" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* History Stats */}
                <Card className="bg-gray-50 rounded-lg p-4 border-0 mt-6">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 mb-1">This Week</h4>
                    <p className="text-sm text-gray-600 mb-3">You've listened to 12 hours of podcasts</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-800">5</div>
                        <div className="text-xs text-gray-600">Episodes</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-800">3</div>
                        <div className="text-xs text-gray-600">Podcasts</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-800">12h</div>
                        <div className="text-xs text-gray-600">Total Time</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Now Playing Bar */}
          <div className="bg-gray-800 px-3 py-3 flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                TF
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">The Future of AI</h4>
              <p className="text-gray-300 text-xs truncate">Tech Talks Daily</p>
            </div>
            <Button variant="ghost" size="icon" className="w-6 h-8 text-white hover:bg-gray-700">
              <PauseIcon className="w-3 h-4" />
            </Button>
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