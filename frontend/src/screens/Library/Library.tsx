import { BookmarkIcon, MicIcon, SearchIcon, HomeIcon, PlayIcon, DownloadIcon, MenuIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, PodcastResponse, API_BASE_URL } from "../../services/api";

interface LibraryProps {
  onNavigate: (screen: string, podcastData?: any) => void;
}

export const Library = ({ onNavigate }: LibraryProps) => {
  const [activeTab, setActiveTab] = useState("downloaded");
  const [generatedPodcasts, setGeneratedPodcasts] = useState<PodcastResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch generated podcasts from backend
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setIsLoading(true);
        const podcasts = await apiService.listPodcasts();
        // Filter only completed podcasts with audio files
        const completedPodcasts = podcasts.filter(
          podcast => podcast.status === "completed" && podcast.audio_file_url
        );
        setGeneratedPodcasts(completedPodcasts);
      } catch (err: any) {
        console.error('Failed to fetch podcasts:', err);
        setError('Failed to load generated podcasts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handlePlayPodcast = (podcast: PodcastResponse) => {
    // Navigate to player with the podcast data
    const podcastData = {
      title: podcast.original_topic.substring(0, 50) + "...",
      host: "AI Generated",
      transcript: podcast.enhanced_script || podcast.original_topic,
      audioUrl: `${API_BASE_URL}${podcast.audio_file_url}`,
      duration: "Unknown",
      date: new Date(podcast.created_at).toLocaleDateString(),
    };
    onNavigate("player", podcastData);
  };

  const handleDownloadPodcast = (podcast: PodcastResponse) => {
    // Create download link for audio file
    const audioUrl = `${API_BASE_URL}${podcast.audio_file_url}`;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `podcast_${podcast.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Generated today";
    if (diffDays === 2) return "Generated yesterday";
    return `Generated ${diffDays} days ago`;
  };

  // Navigation items
  const navItems = [
    { icon: HomeIcon, label: "Home", id: "home" },
    { icon: SearchIcon, label: "Search", id: "search" },
    { icon: BookmarkIcon, label: "Library", id: "library", active: true },
    { icon: MicIcon, label: "Create", id: "create" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex safe-area-top safe-area-bottom">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col flex-shrink-0 safe-area-left
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Neptunize</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                item.active
                  ? "bg-gradient-to-r from-green-400/20 to-blue-500/20 text-green-400 border border-green-400/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with Mobile Menu Button */}
        <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800 p-4 lg:p-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-white">Your Library</h1>
          </div>
        </header>

        {/* Tabs - Mobile Scrollable */}
        <div className="bg-black/30 backdrop-blur-lg border-b border-gray-800 sticky top-[73px] lg:top-[89px] z-30">
          <div className="flex px-4 lg:px-6 overflow-x-auto scrollbar-hide">
            {[
              { id: "downloaded", label: "Generated" },
              { id: "history", label: "History" },
              { id: "my-podcasts", label: "My Podcasts" },
              { id: "saved", label: "Saved" },
              { id: "recently-played", label: "Recently Played" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 lg:px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-green-400 text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Generated Podcasts Tab */}
          {activeTab === "downloaded" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                Your Generated Podcasts
              </h2>
              
              {isLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                  <p className="mt-2 text-gray-400">Loading your podcasts...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {!isLoading && !error && generatedPodcasts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No generated podcasts yet.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Go to Create to generate your first podcast!
                  </p>
                </div>
              )}

              {/* Generated Podcasts List - Mobile Optimized */}
              {generatedPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-4 hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                        {podcast.original_topic.substring(0, 60)}...
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        AI Generated • {formatDate(podcast.created_at)}
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Status: {podcast.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handlePlayPodcast(podcast)}
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black rounded-xl transition-all duration-200 text-sm font-medium transform hover:scale-105"
                      >
                        <PlayIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Play</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPodcast(podcast)}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 text-sm font-medium transform hover:scale-105"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other tabs with placeholder content */}
          {activeTab === "history" && (
            <div className="text-center py-8">
              <p className="text-gray-500">History tab - Coming soon!</p>
            </div>
          )}

          {activeTab === "my-podcasts" && (
            <div className="text-center py-8">
              <p className="text-gray-500">My Podcasts tab - Coming soon!</p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-8">
              <p className="text-gray-500">Saved tab - Coming soon!</p>
            </div>
          )}

          {activeTab === "recently-played" && (
            <div className="text-center py-8">
              <p className="text-gray-500">Recently Played tab - Coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};