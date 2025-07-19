import { BookmarkIcon, MicIcon, SearchIcon, SendIcon, HomeIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "../Search";
import { Library } from "../Library";
import { Home } from "../Home";
import { PodcastPlayer } from "../PodcastPlayer";
import { Auth } from "../../components/Auth";
import { InstallPrompt } from "../../components/InstallPrompt";
import { apiService, PodcastResponse } from "../../services/api";

// Define proper interfaces
interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  options: string[];
}

export const Frame = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState("generate");
  const [inputMessage, setInputMessage] = useState("");
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPodcast, setGeneratedPodcast] = useState<PodcastResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      content: "Hi! I'm your AI podcast assistant. Tell me what topic you'd like to create a podcast about, and I'll help you generate engaging content. You can describe any subject - from science and technology to storytelling and interviews!",
      timestamp: new Date(),
      options: [
        "Technology trends",
        "Science discoveries", 
        "Personal stories",
        "Business insights",
        "Health & wellness"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  // Helper function to extract topic from conversation
  const extractTopicFromConversation = (messages: Message[]): string => {
    const recentUserMessages = messages
      .filter(msg => msg.sender === "user")
      .slice(-3) // Look at last 3 user messages
      .reverse();
    
    const generationKeywords = [
      "generate", "create", "make", "start", "begin", "yes", "ok", "sure", "proceed"
    ];
    
    for (const msg of recentUserMessages) {
      const content = msg.content.toLowerCase();
      const hasGenerationKeyword = generationKeywords.some(kw => content.includes(kw));
      
      // If message doesn't contain generation keywords and is substantial, it's likely a topic
      if (!hasGenerationKeyword && msg.content.length > 5) {
        return msg.content;
      }
    }
    
    return "";
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (screen: string, podcastData?: any) => {
    setCurrentScreen(screen);
    if (podcastData) {
      setSelectedPodcast(podcastData);
    }
  };

  // Show authentication screen if not logged in
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

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

  // Send message to backend API
  const sendMessageToAPI = async (userMessage: string) => {
    try {
      const response = await apiService.sendChatMessage({ content: userMessage });
      return {
        content: response.content,
        options: response.options || [],
        suggested_topic: response.suggested_topic,
        suggested_type: response.suggested_type
      };
    } catch (error) {
      console.error('Failed to get AI response:', error);
      return {
        content: "I'm sorry, I'm having trouble connecting right now. Could you please try again?",
        options: ["Try again", "Contact support"]
      };
    }
  };

  // Handle option selection from AI responses
  const handleOptionSelect = async (option: string) => {
    // Add user selection as a message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: option,
      timestamp: new Date(),
      options: []
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Check if this is a podcast generation request
    const generationKeywords = [
      "generate podcast",
      "create podcast", 
      "start generation",
      "generate now",
      "create now",
      "yes, generate",
      "proceed with generation"
    ];
    
    const isGenerationRequest = generationKeywords.some(keyword => 
      option.toLowerCase().includes(keyword.toLowerCase())
    );

    // Check if this is a "Play Podcast" request
    if (option.toLowerCase().includes("play podcast") && generatedPodcast) {
      handleNavigate("player", generatedPodcast);
      return;
    }

    // Check if this is a "Download Audio" request
    if (option.toLowerCase().includes("download") && generatedPodcast?.audio_file_url) {
      window.open(generatedPodcast.audio_file_url, '_blank');
      return;
    }

    // Check if this is a "Generate Another" request
    if (option.toLowerCase().includes("generate another")) {
      // Reset state and start fresh conversation
      setGeneratedPodcast(null);
      setMessages([{
        id: 1,
        sender: "ai",
        content: "Great! Let's create another podcast. What topic would you like to explore this time?",
        timestamp: new Date(),
        options: []
      }]);
      return;
    }

    if (isGenerationRequest) {
      // Extract topic from the recent conversation
      let extractedTopic = extractTopicFromConversation(messages);
      
      // If no topic found from conversation, try to extract from current option
      if (!extractedTopic) {
        extractedTopic = option.replace(/generate podcast about|create podcast about|generate|create|yes,?\s*/gi, '').trim();
      }
      
      if (extractedTopic && extractedTopic.length > 2) {
        await handleGeneratePodcast(extractedTopic);
      } else {
        // Ask for topic clarification
        const clarificationMessage: Message = {
          id: messages.length + 2,
          sender: "ai",
          content: "I'd love to help you generate a podcast! Could you please tell me what specific topic you'd like the podcast to be about?",
          timestamp: new Date(),
          options: [
            "Technology trends",
            "Science discoveries", 
            "Personal stories",
            "Business insights",
            "Health & wellness"
          ]
        };
        setMessages(prev => [...prev, clarificationMessage]);
      }
      return;
    }

    // Check if this is one of the initial topic suggestions
    const topicSuggestions = [
      "technology trends",
      "science discoveries", 
      "personal stories",
      "business insights",
      "health & wellness"
    ];
    
    const isTopicSuggestion = topicSuggestions.some(topic => 
      option.toLowerCase().includes(topic.toLowerCase())
    );

    if (isTopicSuggestion) {
      // User selected a topic suggestion, offer to generate immediately
      const topicMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: `Great choice! I can create an engaging podcast about ${option.toLowerCase()}. Would you like me to generate it now, or would you prefer to give me more specific details about what aspect you'd like to focus on?`,
        timestamp: new Date(),
        options: [
          `Generate podcast about ${option}`,
          "Let me be more specific",
          "Tell me what you'll include"
        ]
      };
      
      setMessages(prev => [...prev, topicMessage]);
      return;
    }

    setIsTyping(true);

    try {
      // Get AI response based on selected option
      const aiResponse = await sendMessageToAPI(option);
      
      // Check if AI response suggests podcast generation
      const shouldTriggerGeneration = aiResponse.content.toLowerCase().includes("shall i generate") || 
                                     aiResponse.content.toLowerCase().includes("ready to create") ||
                                     aiResponse.content.toLowerCase().includes("would you like me to generate");
      
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        options: shouldTriggerGeneration ? 
          [...(aiResponse.options || []), "Yes, generate the podcast!", "Let me modify the topic first"] :
          aiResponse.options || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to handle option selection:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: "I'm sorry, I encountered an issue. Could you please try again?",
        timestamp: new Date(),
        options: ["Try again"]
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  // Handle generating podcast
  const handleGeneratePodcast = async (topic: string) => {
    setIsGeneratingPodcast(true);
    setGenerationProgress(0);
    
    // Add generation start message
    const generationMessage: Message = {
      id: messages.length + 1,
      sender: "ai",
      content: `Perfect! I'm now generating your podcast about "${topic}". This will take a few moments...`,
      timestamp: new Date(),
      options: []
    };
    
    setMessages(prev => [...prev, generationMessage]);

    try {
      // Call backend API to create podcast
      const podcastData = {
        original_topic: topic,
        podcast_type: "general",
        target_duration: 10,
        target_audience: "general"
      };

      const podcastResponse = await apiService.createPodcast(podcastData);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      // Poll for completion (in a real app, you'd use WebSockets or Server-Sent Events)
      const checkPodcastStatus = async () => {
        try {
          const updatedPodcast = await apiService.getPodcast(podcastResponse.id);
          if (updatedPodcast.status === "completed" && updatedPodcast.audio_file_url) {
            clearInterval(progressInterval);
            setGenerationProgress(100);
            setIsGeneratingPodcast(false);
            setGeneratedPodcast(updatedPodcast);

            const completionMessage: Message = {
              id: messages.length + 2,
              sender: "ai",
              content: "🎉 Your podcast has been generated successfully! You can now listen to it or make adjustments.",
              timestamp: new Date(),
              options: ["Play Podcast", "Generate Another", "Download Audio"]
            };
            
            setMessages(prev => [...prev, completionMessage]);
          } else if (updatedPodcast.status === "failed") {
            throw new Error("Podcast generation failed");
          } else {
            // Still processing, check again in 3 seconds
            setTimeout(checkPodcastStatus, 3000);
          }
        } catch (error) {
          console.error('Error checking podcast status:', error);
          clearInterval(progressInterval);
          setIsGeneratingPodcast(false);
          
          const errorMessage: Message = {
            id: messages.length + 2,
            sender: "ai",
            content: "I'm sorry, there was an issue generating your podcast. Please try again.",
            timestamp: new Date(),
            options: ["Try Again", "Contact Support"]
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      };

      // Start checking status after 5 seconds
      setTimeout(checkPodcastStatus, 5000);

    } catch (error) {
      console.error('Failed to start podcast generation:', error);
      setIsGeneratingPodcast(false);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: "ai",
        content: "I'm sorry, I couldn't start the podcast generation. Please try again.",
        timestamp: new Date(),
        options: ["Try Again", "Contact Support"]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Handle sending chat messages
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        content: inputMessage.trim(),
        timestamp: new Date(),
        options: []
      };
      
      setMessages(prev => [...prev, userMessage]);
      const messageContent = inputMessage.trim();
      setInputMessage("");

      // Check if user directly requested podcast generation
      const directGenerationKeywords = [
        "generate a podcast",
        "create a podcast", 
        "make a podcast",
        "generate podcast",
        "create podcast"
      ];
      
      const isDirectGeneration = directGenerationKeywords.some(keyword => 
        messageContent.toLowerCase().includes(keyword)
      );

      if (isDirectGeneration) {
        // Extract topic from the message
        let topic = messageContent;
        directGenerationKeywords.forEach(keyword => {
          const regex = new RegExp(keyword + "\\s+(about\\s+|on\\s+)?", 'gi');
          topic = topic.replace(regex, '').trim();
        });
        
        if (topic && topic.length > 2) {
          await handleGeneratePodcast(topic);
          return;
        }
      }
      
      setIsTyping(true);
      
      try {
        // Get AI response from backend API
        const aiResponse = await sendMessageToAPI(messageContent);
        
        // Enhance AI response with generation options if topic is mentioned
        let enhancedOptions = aiResponse.options || [];
        
        // Check if the AI response suggests readiness for generation
        const suggestsGeneration = aiResponse.content.toLowerCase().includes("shall i generate") || 
                                 aiResponse.content.toLowerCase().includes("ready to create") ||
                                 aiResponse.content.toLowerCase().includes("would you like me to generate") ||
                                 aiResponse.content.toLowerCase().includes("should i create");
        
        // If AI suggests generation or user mentioned a clear topic, add generation options
        if (suggestsGeneration || (messageContent.length > 10 && !messageContent.includes("?"))) {
          if (!enhancedOptions.some(opt => opt.toLowerCase().includes("generate"))) {
            enhancedOptions = [...enhancedOptions, `Generate podcast about "${messageContent}"`];
          }
        }
        
        const aiMessage: Message = {
          id: messages.length + 2,
          sender: "ai",
          content: aiResponse.content,
          timestamp: new Date(),
          options: enhancedOptions
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          sender: "ai",
          content: "I'm sorry, I'm having trouble connecting right now. Could you please try again?",
          timestamp: new Date(),
          options: ["Try again"]
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-gray-900 to-black min-h-screen">
        {/* Mobile Container with full viewport height */}
        <div className="flex flex-col min-h-screen relative">
          {/* Status Bar Safe Area */}
          <div className="h-safe-top"></div>
          
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Neptunize</h1>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-black font-semibold">
                AI
              </AvatarFallback>
            </Avatar>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-black">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-800/80 backdrop-blur-lg text-gray-100 border border-gray-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {/* Show options for AI messages */}
                  {message.sender === "ai" && message.options && message.options.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleOptionSelect(option)}
                          className="block w-full text-left text-xs bg-gradient-to-r from-gray-700 to-gray-600 hover:from-green-500 hover:to-blue-500 text-gray-200 hover:text-white px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Show generation progress */}
                  {isGeneratingPodcast && index === messages.length - 1 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                        <span>Generating...</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 backdrop-blur-lg text-gray-300 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-black/50 backdrop-blur-lg border-t border-gray-800 p-4">
            <div className="flex space-x-3 items-center">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400/30"
                disabled={isGeneratingPodcast}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGeneratingPodcast}
                className="rounded-full w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                <SendIcon className="w-5 h-5 text-black" />
              </Button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-black/70 backdrop-blur-lg border-t border-gray-800 px-4 py-2 safe-area-bottom">
            <div className="flex justify-around items-center">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.screen)}
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
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};
