import { BookmarkIcon, MicIcon, SearchIcon, SendIcon, HomeIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Search } from "../Search";
import { Library } from "../Library";
import { Home } from "../Home";
import { PodcastPlayer } from "../PodcastPlayer";

export const Frame = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState("generate");
  const [inputMessage, setInputMessage] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPodcast, setGeneratedPodcast] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content: "Hi! I'm your AI podcast assistant. Tell me what topic you'd like to create a podcast about, and I'll help you generate engaging content.",
      timestamp: new Date(),
      options: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleNavigate = (screen: string, podcastData?: any) => {
    setCurrentScreen(screen);
    if (podcastData) {
      setSelectedPodcast(podcastData);
    }
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

  // Show Podcast Player screen if selected
  if (currentScreen === "player") {
    return <PodcastPlayer onNavigate={handleNavigate} podcastData={selectedPodcast} />;
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

  // AI response templates based on user input
  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("sustainable") || lowerMessage.includes("environment") || lowerMessage.includes("green")) {
      return {
        content: "Great topic! Sustainable living is very popular right now. I can help you create engaging content about eco-friendly practices. Would you like me to:",
        options: [
          "📝 Generate episode outline",
          "🎙 Create full script",
          "💡 Suggest episode topics",
          "🎯 Define target audience"
        ]
      };
    } else if (lowerMessage.includes("tech") || lowerMessage.includes("technology") || lowerMessage.includes("ai")) {
      return {
        content: "Excellent choice! Technology podcasts have a huge audience. I can help you create content that's both informative and accessible. What would you like to focus on:",
        options: [
          "🤖 AI and Machine Learning",
          "📱 Consumer Technology",
          "💻 Programming and Development",
          "🚀 Startup and Innovation"
        ]
      };
    } else if (lowerMessage.includes("business") || lowerMessage.includes("entrepreneur") || lowerMessage.includes("startup")) {
      return {
        content: "Business podcasts are incredibly valuable for listeners! I can help you create content that provides real value to entrepreneurs and professionals. Let's start with:",
        options: [
          "💼 Leadership and Management",
          "📈 Marketing and Sales",
          "💰 Finance and Investment",
          "🎯 Strategy and Growth"
        ]
      };
    } else if (lowerMessage.includes("health") || lowerMessage.includes("fitness") || lowerMessage.includes("wellness")) {
      return {
        content: "Health and wellness is such an important topic! I can help you create content that genuinely helps people improve their lives. What aspect interests you most:",
        options: [
          "🏃‍♂️ Fitness and Exercise",
          "🥗 Nutrition and Diet",
          "🧘‍♀️ Mental Health and Mindfulness",
          "😴 Sleep and Recovery"
        ]
      };
    } else {
      return {
        content: `Interesting topic! "${userMessage}" could make for a compelling podcast. Let me help you develop this idea further. What format are you thinking:`,
        options: [
          "🎤 Interview-style podcast",
          "📚 Educational/Tutorial format",
          "💬 Conversational discussion",
          "📖 Storytelling approach"
        ]
      };
    }
  };

  const simulatePodcastGeneration = (topic: string, format: string, length: string) => {
    setIsGeneratingPodcast(true);
    setGenerationProgress(0);
    
    // Add generation start message
    const generationMessage = {
      id: messages.length + 1,
      sender: "ai",
      content: `Perfect! I'm now generating your podcast about "${topic}" in ${format} format with ${length} length. This will take a few moments...`,
      timestamp: new Date(),
      options: []
    };
    
    setMessages(prev => [...prev, generationMessage]);
    
    // Simulate progress steps
    const steps = [
      { progress: 15, message: "🧠 Analyzing topic and gathering insights..." },
      { progress: 30, message: "📝 Creating episode structure and outline..." },
      { progress: 50, message: "🎙️ Writing engaging script and dialogue..." },
      { progress: 70, message: "🎵 Adding transitions and audio cues..." },
      { progress: 85, message: "✨ Polishing content and final touches..." },
      { progress: 100, message: "🎉 Your podcast is ready!" }
    ];
    
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress(steps[currentStep].progress);
        
        // Add progress message
        const progressMessage = {
          id: messages.length + 2 + currentStep,
          sender: "ai",
          content: steps[currentStep].message,
          timestamp: new Date(),
          options: [],
          isProgress: true
        };
        
        setMessages(prev => [...prev, progressMessage]);
        currentStep++;
      } else {
        clearInterval(progressInterval);
        
        // Generate final podcast data
        const podcastData = {
          title: topic.includes("sustainable") ? "Sustainable Living Made Simple" :
                 topic.includes("tech") ? "The Future of Technology" :
                 topic.includes("business") ? "Business Growth Strategies" :
                 topic.includes("health") ? "Wellness and You" :
                 `${topic} Insights`,
          duration: length.includes("15-20") ? "18:45" : 
                   length.includes("30-45") ? "42:30" : "68:15",
          format: format,
          topic: topic,
          script: "Full script generated with engaging content, natural transitions, and clear call-to-actions.",
          audioReady: true
        };
        
        setGeneratedPodcast(podcastData);
        
        // Add completion message with options
        const completionMessage = {
          id: messages.length + 10,
          sender: "ai",
          content: `🎉 Your podcast "${podcastData.title}" is ready! Duration: ${podcastData.duration}. What would you like to do next?`,
          timestamp: new Date(),
          options: [
            "🎧 Preview Podcast",
            "📝 View Full Script", 
            "📤 Publish to Library",
            "🔄 Generate Another"
          ]
        };
        
        setMessages(prev => [...prev, completionMessage]);
        setIsGeneratingPodcast(false);
        setIsTyping(false);
      }
    }, 1500); // Progress every 1.5 seconds
  };
  const handleOptionClick = (option: string) => {
    // Add user's option selection as a message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: option,
      timestamp: new Date(),
      options: []
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      let aiResponse;
      
      if (option.includes("Preview Podcast")) {
        // Navigate to podcast player with generated content
        const podcastPlayerData = {
          title: generatedPodcast?.title || "Generated Podcast",
          podcast: "Your Podcast",
          episode: "Episode 1 • " + (generatedPodcast?.duration || "30 min"),
          duration: generatedPodcast?.duration || "30:00",
          currentTime: "0:00",
          progress: 0,
        };
        setSelectedPodcast(podcastPlayerData);
        setCurrentScreen("player");
        return;
      } else if (option.includes("View Full Script")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: `Here's your complete podcast script:\n\n[INTRO]\nWelcome to "${generatedPodcast?.title}"...\n\n[MAIN CONTENT]\nToday we're exploring ${generatedPodcast?.topic}...\n\n[CONCLUSION]\nThat's a wrap for today's episode...\n\nWould you like me to make any adjustments?`,
          timestamp: new Date(),
          options: [
            "✏️ Edit Script",
            "💾 Save Script",
            "🎧 Preview Audio",
            "📤 Publish Episode"
          ]
        };
      } else if (option.includes("Publish to Library")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: `Great! I'm publishing "${generatedPodcast?.title}" to your library. Your podcast will be available in the Library section and can be shared with your followers.`,
          timestamp: new Date(),
          options: [
            "📚 View in Library",
            "📱 Share Podcast",
            "🎙️ Create Another",
            "📊 View Analytics"
          ]
        };
      } else if (option.includes("Generate Another")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Excellent! Let's create another podcast. What topic would you like to explore this time?",
          timestamp: new Date(),
          options: [
            "💡 Suggest Popular Topics",
            "🔄 Use Different Format",
            "📈 Business & Finance",
            "🎨 Creative & Arts"
          ]
        };
      } else if (option.includes("Generate episode outline")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Perfect! I'll create a detailed episode outline for you. Here's what I'll include: introduction hook, main talking points, guest interview questions (if applicable), and a strong conclusion. What's your target episode length?",
          timestamp: new Date(),
          options: [
            "⏱️ 15-20 minutes (short format)",
            "⏱️ 30-45 minutes (standard)",
            "⏱️ 60+ minutes (long form)"
          ]
        };
      } else if (option.includes("Create full script")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Excellent! I'll write a complete script with natural transitions, engaging hooks, and clear call-to-actions. Should I include specific sections like sponsor mentions or audience interaction prompts?",
          timestamp: new Date(),
          options: [
            "📢 Include sponsor segments",
            "🎯 Add audience engagement",
            "📝 Just core content",
            "🎵 Include music cues"
          ]
        };
      } else if (option.includes("Suggest episode topics")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Great idea! I'll suggest 10 episode topics that will keep your audience engaged and coming back for more. How many episodes are you planning for your first season?",
          timestamp: new Date(),
          options: [
            "📅 5-8 episodes (mini season)",
            "📅 10-12 episodes (standard)",
            "📅 15+ episodes (full season)",
            "🔄 Ongoing series"
          ]
        };
      } else if (option.includes("minutes") && option.includes("⏱️")) {
        // This is a length selection, trigger podcast generation
        const topic = messages.find(m => m.sender === "user")?.content || "Your Topic";
        const format = "Podcast format";
        simulatePodcastGeneration(topic, format, option);
        return; // Don't add the normal AI response
      } else if (option.includes("Content planning") || option.includes("Recording setup") || 
                 option.includes("Audience building") || option.includes("Topic brainstorming")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Great choice! Now let's get your podcast created. What's your preferred episode length for this topic?",
          timestamp: new Date(),
          options: [
            "⏱️ 15-20 minutes (short format)",
            "⏱️ 30-45 minutes (standard)",
            "⏱️ 60+ minutes (long form)"
          ]
        };
      } else if (option.includes("Weekly themes") || option.includes("Series format") || 
                 option.includes("Educational episodes") || option.includes("Mixed content") ||
                 option.includes("Business") || option.includes("Technology") || 
                 option.includes("Health") || option.includes("Creative") ||
                 option.includes("Solo expertise") || option.includes("Interview guests") ||
                 option.includes("Panel discussions") || option.includes("Storytelling")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Perfect! That's exactly what your audience will love. Now let's create your first episode. How long would you like it to be?",
          timestamp: new Date(),
          options: [
            "⏱️ 15-20 minutes (short format)",
            "⏱️ 30-45 minutes (standard)",
            "⏱️ 60+ minutes (long form)"
          ]
        };
      } else if (option.includes("Complete beginner")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Perfect! As a beginner, I'll guide you through everything step by step. Let's start with the basics. What type of podcast format appeals to you most?",
          timestamp: new Date(),
          options: [
            "🎤 Solo commentary (just you talking)",
            "👥 Interview style (you + guests)",
            "📚 Educational/tutorial format",
            "💬 Conversational with co-host"
          ]
        };
      } else if (option.includes("Some experience")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Great! Since you have some experience, we can dive deeper into content strategy. What's your main goal with this new podcast?",
          timestamp: new Date(),
          options: [
            "🎯 Build personal brand",
            "💼 Generate business leads",
            "📈 Monetize content",
            "🌟 Share expertise/passion"
          ]
        };
      } else if (option.includes("Experienced podcaster")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Excellent! As an experienced podcaster, you know the drill. Let's focus on creating high-quality content efficiently. What's your biggest challenge right now?",
          timestamp: new Date(),
          options: [
            "⏰ Content creation speed",
            "🎯 Audience growth",
            "💡 Fresh topic ideas",
            "🔧 Production workflow"
          ]
        };
      } else if (option.includes("Professional creator")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Amazing! As a professional, you understand the industry well. I can help you scale your content creation. What type of content are you looking to produce?",
          timestamp: new Date(),
          options: [
            "🚀 Premium series content",
            "📊 Data-driven episodes",
            "🎬 Multi-format content",
            "🔄 Batch content creation"
          ]
        };
      } else if (option.includes("Solo commentary")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Solo podcasts are fantastic for building a personal connection with your audience! I'll help you create engaging monologue content. How long would you like your episodes to be?",
          timestamp: new Date(),
          options: [
            "⏱️ 10-15 minutes (bite-sized)",
            "⏱️ 20-30 minutes (standard)",
            "⏱️ 45+ minutes (deep dive)"
          ]
        };
      } else if (option.includes("Interview style")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Interview podcasts are great for providing diverse perspectives! I'll help you create compelling questions and structure. What's your target episode length?",
          timestamp: new Date(),
          options: [
            "⏱️ 30-45 minutes (focused)",
            "⏱️ 45-60 minutes (standard)",
            "⏱️ 60+ minutes (in-depth)"
          ]
        };
      } else if (option.includes("Educational/tutorial")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Educational content is incredibly valuable! I'll help you break down complex topics into digestible episodes. What's your preferred episode structure?",
          timestamp: new Date(),
          options: [
            "⏱️ 15-20 minutes (quick lessons)",
            "⏱️ 30-45 minutes (comprehensive)",
            "⏱️ 60+ minutes (masterclass style)"
          ]
        };
      } else if (option.includes("Conversational with co-host")) {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "Co-hosted shows create great dynamic conversations! I'll help you plan topics and talking points that work well for two hosts. How long do you want each episode?",
          timestamp: new Date(),
          options: [
            "⏱️ 25-35 minutes (casual chat)",
            "⏱️ 45-60 minutes (deep discussion)",
            "⏱️ 60+ minutes (extended conversation)"
          ]
        };
      } else {
        aiResponse = {
          id: messages.length + 2,
          sender: "ai",
          content: "That's a great choice! I'll help you develop this further. Let me know what specific aspect you'd like to focus on first.",
          timestamp: new Date(),
          options: [
            "📝 Content planning",
            "🎙️ Recording setup",
            "📈 Audience building",
            "💡 Topic brainstorming"
          ]
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        sender: "user",
        content: inputMessage.trim(),
        timestamp: new Date(),
        options: []
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse = getAIResponse(inputMessage.trim());
        const aiMessage = {
          id: messages.length + 2,
          sender: "ai",
          content: aiResponse.content,
          timestamp: new Date(),
          options: aiResponse.options
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
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
            {/* Dynamic Messages */}
            {messages.map((message, index) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : ""}`}>
                {message.sender === "ai" && (
                  <Avatar className="w-8 h-8 bg-gray-600 flex-shrink-0">
                    <AvatarFallback className="text-white text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <Card className={`rounded-2xl p-3 max-w-[280px] ${
                  message.sender === "ai" 
                    ? "bg-gray-100 rounded-tl-md" 
                    : "bg-black rounded-tr-md"
                }`}>
                  {/* Progress bar for generation messages */}
                  {message.isProgress && isGeneratingPodcast && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{generationProgress}% complete</div>
                    </div>
                  )}
                  
                  <div className={`text-sm leading-relaxed ${
                    message.sender === "ai" ? "text-gray-800" : "text-white"
                  }`}>
                    {message.content}
                  </div>
                  
                  {/* Options for AI messages */}
                  {message.sender === "ai" && message.options.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {message.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          onClick={() => handleOptionClick(option)}
                          variant="outline"
                          className="w-full justify-start h-auto py-2 px-3 text-xs font-normal text-gray-800 bg-white hover:bg-gray-50 border-gray-300 rounded-lg"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </Card>
                
                {message.sender === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 bg-gray-600 flex-shrink-0">
                  <AvatarFallback className="text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-gray-100 rounded-2xl rounded-tl-md p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            {/* Generation Status */}
            {isGeneratingPodcast && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-800">Generating your podcast...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600 mt-1">{generationProgress}% complete</div>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping || isGeneratingPodcast}
                className="flex-1 border-0 bg-transparent shadow-none text-sm placeholder:text-gray-500 focus-visible:ring-0"
                placeholder="Type your message..."
              />
              <Button
                onClick={handleSendMessage}
                disabled={isTyping || isGeneratingPodcast || !inputMessage.trim()}
                size="icon"
                className="w-8 h-8 bg-black hover:bg-gray-800 rounded-full flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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