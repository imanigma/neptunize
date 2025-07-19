import { BookmarkIcon, MicIcon, SearchIcon, SendIcon, HomeIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search } from "../Search";
import { Library } from "../Library";
import { Home } from "../Home";

export const Frame = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState("generate");
  const [message, setMessage] = useState("");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  // Show Home screen if selected
  if (currentScreen === "home") {
    return <Home onNavigate={handleNavigate} />;
  }

  // Show Search screen if selected
  if (currentScreen === "search") {
    return <Search onNavigate={handleNavigate} />;
  }

  // Show Library screen if selected
  if (currentScreen === "library") {
    return <Library onNavigate={handleNavigate} />;
  }

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
      active: currentScreen === "generate",
      screen: "generate",
    },
    {
      icon: <SearchIcon className="w-5 h-5" />,
      label: "Search",
      active: currentScreen === "search",
      screen: "search",
    },
    {
      icon: <BookmarkIcon className="w-[15px] h-5" />,
      label: "Library",
      active: currentScreen === "library",
      screen: "library",
    },
  ];

  // Chat messages data
  const messages = [
    {
      sender: "ai",
      content: [
        "Hi! I'm your AI podcast assistant. Tell",
        "me what topic you'd like to create a",
        "podcast about, and I'll help you",
        "generate engaging content.",
      ],
    },
    {
      sender: "user",
      content: ["I want to create a podcast about", "sustainable living tips"],
    },
    {
      sender: "ai",
      content: [
        "Great topic! I can help you create a",
        "podcast about sustainable living.",
        "Would you like me to:",
      ],
      options: [
        "📝 Generate episode outline",
        "🎙 Create full script",
        "💡 Suggest episode topics",
      ],
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Container */}
        <div className="flex flex-col h-[844px] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-semibold text-gray-800">PodcastAI</h1>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-300 text-gray-600">
                U
              </AvatarFallback>
            </Avatar>
          </header>

          {/* Chat Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* AI Welcome Message */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-gray-600 flex-shrink-0">
                <AvatarFallback className="text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <Card className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-[280px]">
                <div className="text-sm text-gray-800 leading-relaxed">
                  {messages[0].content.join(" ")}
                </div>
              </Card>
            </div>

            {/* User Message */}
            <div className="flex gap-3 justify-end">
              <Card className="bg-black rounded-2xl rounded-tr-md p-3 max-w-[280px]">
                <div className="text-sm text-white leading-relaxed">
                  {messages[1].content.join(" ")}
                </div>
              </Card>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  U
                </AvatarFallback>
              </Avatar>
            </div>

            {/* AI Response with Options */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-gray-600 flex-shrink-0">
                <AvatarFallback className="text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <Card className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-[280px]">
                <div className="text-sm text-gray-800 leading-relaxed mb-3">
                  {messages[2].content.join(" ")}
                </div>
                <div className="space-y-2">
                  {messages[2].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto py-2 px-3 text-xs font-normal text-gray-800 bg-white hover:bg-gray-50 border-gray-300 rounded-lg"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-0 bg-transparent shadow-none text-sm placeholder:text-gray-500 focus-visible:ring-0"
                placeholder="Type your message..."
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="w-8 h-8 bg-black hover:bg-gray-800 rounded-full flex-shrink-0"
              >
                <SendIcon className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.screen)}
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