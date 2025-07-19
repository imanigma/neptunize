import { ArrowLeftIcon, MoreHorizontalIcon, PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, ListIcon, HeartIcon, ShareIcon, VolumeXIcon, Volume2Icon } from "lucide-react";
import React, { useState } from "react";

interface PodcastPlayerProps {
  onNavigate: (screen: string, podcastData?: any) => void;
  podcastData?: {
    id?: number;
    title: string;
    original_topic?: string;
    podcast?: string;
    episode?: string;
    duration?: string;
    currentTime?: string;
    progress?: number;
    audioUrl?: string;
    audio_file_url?: string;
    script?: string;
    enhanced_script?: string;
  };
}

export const PodcastPlayer = ({ onNavigate, podcastData }: PodcastPlayerProps): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Default podcast data if none provided
  const podcast = podcastData || {
    title: "The Future of AI Technology",
    podcast: "Tech Insights Podcast",
    episode: "Episode 42 • 45 min",
    duration: "45:20",
    currentTime: "12:34",
    progress: 28, // 28% progress
  };

  // Use the correct audio URL from the podcast data
  const audioUrl = podcastData?.audioUrl || podcastData?.audio_file_url;
  const podcastTitle = podcastData?.title || podcastData?.original_topic || podcast.title;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white safe-area-top safe-area-bottom">
      <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-black/30 backdrop-blur-lg">
          <button 
            onClick={() => onNavigate("library")}
            className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Now Playing</h1>
          <button className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
            <MoreHorizontalIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex justify-center px-8 py-8">
          <div className="relative">
            <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-1 shadow-2xl shadow-green-500/20">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative overflow-hidden">
                {/* Podcast Logo/Art */}
                <div className="text-center p-8">
                  <div className="text-4xl font-black text-black mb-2 tracking-tighter">
                    NEPTUNIZE
                  </div>
                  <div className="text-lg font-bold text-black/80">
                    AI PODCAST
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl"></div>
              </div>
            </div>
            
            {/* Floating shadow/glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center px-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {podcastTitle}
          </h2>
          <p className="text-lg text-gray-400">
            {podcast.podcast || "AI Generated"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {podcast.episode || "Generated Content"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 mb-8">
          <div className="relative">
            <div className="w-full h-2 bg-gray-800 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full relative"
                style={{ width: `${podcast.progress || 0}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{podcast.currentTime || "0:00"}</span>
            <span>{podcast.duration || "0:00"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-8 px-8 mb-8">
          <button className="p-3 rounded-full hover:bg-gray-800/50 transition-colors">
            <SkipBackIcon className="w-6 h-6 text-gray-300" />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? (
              <PauseIcon className="w-8 h-8 text-black ml-1" />
            ) : (
              <PlayIcon className="w-8 h-8 text-black ml-1" />
            )}
          </button>
          
          <button className="p-3 rounded-full hover:bg-gray-800/50 transition-colors">
            <SkipForwardIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between px-8 mb-8">
          <button className="p-3 rounded-full hover:bg-gray-800/50 transition-colors">
            <HeartIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="p-3 rounded-full hover:bg-gray-800/50 transition-colors">
            <ShareIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button onClick={handleVolumeToggle} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              {isMuted ? (
                <VolumeXIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <Volume2Icon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          
          <button className="p-3 rounded-full hover:bg-gray-800/50 transition-colors">
            <ListIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Up Next */}
        <div className="px-8 pb-8">
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Playing Next</h3>
              <MoreHorizontalIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">More AI Podcasts</p>
                <p className="text-gray-400 text-xs">Neptunize</p>
              </div>
              <PlayIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Audio element */}
        {audioUrl && (
          <audio
            controls
            className="hidden"
            src={audioUrl}
            autoPlay={isPlaying}
          />
        )}
      </div>
    </div>
  );
};