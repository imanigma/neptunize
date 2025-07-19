import { ArrowLeftIcon, MoreHorizontalIcon, PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, ListIcon, HeartIcon, ShareIcon, VolumeXIcon, Volume2Icon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";

interface PodcastPlayerProps {
  onNavigate: (screen: string, podcastData?: any) => void;
  podcastData?: {
    title: string;
    podcast: string;
    episode: string;
    duration: string;
    currentTime: string;
    progress: number;
  };
}

export const PodcastPlayer = ({ onNavigate, podcastData }: PodcastPlayerProps): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(75);
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleGoBack = () => {
    // Go back to the previous screen (could be search or library)
    onNavigate("search");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Container */}
        <div className="flex flex-col h-[844px] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-9 h-9"
              onClick={handleGoBack}
            >
              <ArrowLeftIcon className="w-[18px] h-[18px] text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-6 py-6 flex flex-col">
            {/* Album Art */}
            <div className="flex justify-center mb-8">
              <div className="w-72 h-72 bg-gray-300 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white text-lg font-medium">Podcast Cover Art</span>
              </div>
            </div>

            {/* Podcast Info */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-medium text-gray-800 mb-2 leading-7">
                {podcast.title}
              </h1>
              <p className="text-base text-gray-600 mb-1">
                {podcast.podcast}
              </p>
              <p className="text-sm text-gray-500">
                {podcast.episode}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{podcast.currentTime}</span>
                <span>{podcast.duration}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-gray-800 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${podcast.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button variant="ghost" size="icon" className="w-9 h-11">
                <SkipBackIcon className="w-3 h-5 text-gray-600" />
              </Button>
              
              <Button variant="ghost" size="icon" className="w-[42px] h-[42px]">
                <SkipBackIcon className="w-[18px] h-[18px] text-gray-600 rotate-180" />
              </Button>
              
              <Button 
                onClick={handlePlayPause}
                className="w-12 h-14 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center"
              >
                {isPlaying ? (
                  <PauseIcon className="w-4 h-6 text-white" />
                ) : (
                  <PlayIcon className="w-4 h-6 text-white ml-1" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className="w-[42px] h-[42px]">
                <SkipForwardIcon className="w-[18px] h-[18px] text-gray-600" />
              </Button>
              
              <Button variant="ghost" size="icon" className="w-9 h-11">
                <SkipForwardIcon className="w-3 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ListIcon className="w-4 h-4" />
                <span className="text-sm">Episodes</span>
              </Button>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ShareIcon className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-[14px] h-4"
                onClick={handleVolumeToggle}
              >
                {isMuted ? (
                  <VolumeXIcon className="w-[14px] h-4 text-gray-600" />
                ) : (
                  <Volume2Icon className="w-[14px] h-4 text-gray-600" />
                )}
              </Button>
              
              <div className="flex-1 bg-gray-200 rounded-full h-1 relative">
                <div 
                  className="bg-gray-800 h-1 rounded-full transition-all duration-300" 
                  style={{ width: isMuted ? '0%' : `${volume}%` }}
                ></div>
              </div>
              
              <Button variant="ghost" size="icon" className="w-5 h-4">
                <Volume2Icon className="w-5 h-4 text-gray-600" />
              </Button>
            </div>
          </main>

          {/* Mini Player Bar */}
          <div className="bg-white px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium">Art</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Currently Playing</p>
                <p className="text-xs text-gray-500">Tech Podcast</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-[10px] h-4">
                  <SkipBackIcon className="w-[10px] h-4 text-gray-600 rotate-180" />
                </Button>
                <Button variant="ghost" size="icon" className="w-[10px] h-4">
                  <SkipForwardIcon className="w-[10px] h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};