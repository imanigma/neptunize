import { BookmarkIcon, MicIcon, SearchIcon, MoreHorizontalIcon, HomeIcon, UserPlusIcon, UsersIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

interface HomeProps {
  onNavigate: (screen: string, podcastData?: any) => void;
}

export const Home = ({ onNavigate }: HomeProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState("followers");

  // Podcast engagement data
  const podcastEngagement = [
    {
      episodeTitle: "Morning Motivation",
      episodeNumber: "Episode 12",
      timeAgo: "2 hours ago",
      likes: [
        { name: "Alex Thompson", username: "@alexthompson", avatar: "AT" },
        { name: "Sarah Chen", username: "@sarahchen", avatar: "SC" },
        { name: "Mike Rodriguez", username: "@mikerod", avatar: "MR" },
      ],
      comments: [
        { 
          name: "Emma Wilson", 
          username: "@emmawilson", 
          avatar: "EW",
          comment: "Great insights on productivity! Really helped me start my day better.",
          timeAgo: "1 hour ago"
        },
        { 
          name: "David Kim", 
          username: "@davidkim", 
          avatar: "DK",
          comment: "Love this series! When's the next episode coming out?",
          timeAgo: "30 minutes ago"
        },
      ],
      totalLikes: 24,
      totalComments: 8,
    },
    {
      episodeTitle: "Tech Trends 2025",
      episodeNumber: "Episode 8",
      timeAgo: "1 day ago",
      likes: [
        { name: "Sarah Chen", username: "@sarahchen", avatar: "SC" },
        { name: "David Kim", username: "@davidkim", avatar: "DK" },
      ],
      comments: [
        { 
          name: "Alex Thompson", 
          username: "@alexthompson", 
          avatar: "AT",
          comment: "Fascinating predictions! The AI section was particularly insightful.",
          timeAgo: "18 hours ago"
        },
      ],
      totalLikes: 18,
      totalComments: 5,
    },
  ];

  // Navigation items data
  const navItems = [
    {
      icon: <HomeIcon className="w-5 h-5" />,
      label: "Home",
      active: true,
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
      active: false,
      screen: "library",
    },
  ];

  // User stats
  const userStats = {
    followers: 1247,
    following: 89,
    podcasts: 12,
  };

  // Followers data
  const followers = [
    {
      name: "Alex Thompson",
      username: "@alexthompson",
      avatar: "AT",
      isFollowingBack: true,
      mutualFollowers: 5,
    },
    {
      name: "Sarah Chen",
      username: "@sarahchen",
      avatar: "SC",
      isFollowingBack: false,
      mutualFollowers: 12,
    },
    {
      name: "Mike Rodriguez",
      username: "@mikerod",
      avatar: "MR",
      isFollowingBack: true,
      mutualFollowers: 3,
    },
    {
      name: "Emma Wilson",
      username: "@emmawilson",
      avatar: "EW",
      isFollowingBack: false,
      mutualFollowers: 8,
    },
    {
      name: "David Kim",
      username: "@davidkim",
      avatar: "DK",
      isFollowingBack: true,
      mutualFollowers: 15,
    },
  ];

  // Following data
  const following = [
    {
      name: "Joe Rogan",
      username: "@joerogan",
      avatar: "JR",
      category: "Comedy • Interviews",
      verified: true,
    },
    {
      name: "Tim Ferriss",
      username: "@timferriss",
      avatar: "TF",
      category: "Business • Self-Help",
      verified: true,
    },
    {
      name: "Lex Fridman",
      username: "@lexfridman",
      avatar: "LF",
      category: "Technology • AI",
      verified: true,
    },
    {
      name: "Michelle Obama",
      username: "@michelleobama",
      avatar: "MO",
      category: "Society • Culture",
      verified: true,
    },
  ];

  // Suggested users
  const suggestedUsers = [
    {
      name: "Naval Ravikant",
      username: "@naval",
      avatar: "NR",
      category: "Entrepreneurship",
      mutualFollowers: 23,
    },
    {
      name: "Brené Brown",
      username: "@brenebrown",
      avatar: "BB",
      category: "Psychology",
      mutualFollowers: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-gray-900 to-black min-h-screen">
        {/* Mobile Container */}
        <div className="flex flex-col min-h-screen relative">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">Home</h1>
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-800/50">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
            </Button>
          </header>

          {/* User Profile Section */}
          <div className="p-4 bg-black/30 backdrop-blur-lg border-b border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-black text-lg font-semibold">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">Your Profile</h2>
                <p className="text-sm text-gray-400">@yourpodcast</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-around py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-xl border border-gray-700">
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{userStats.podcasts}</div>
                <div className="text-xs text-gray-400">Podcasts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{userStats.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-white">{userStats.following}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 bg-black/30 backdrop-blur-lg">
            {[
              { id: "followers", label: "Followers" },
              { id: "following", label: "Following" },
              { id: "engagement", label: "Engagement" },
              { id: "suggested", label: "Suggested" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-green-400 text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
            {activeTab === "followers" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Followers</h3>
                  <span className="text-sm text-gray-400">{userStats.followers.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {followers.map((follower, index) => (
                    <Card key={index} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-500 text-black text-sm font-semibold">
                            {follower.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">{follower.name}</h4>
                          <p className="text-sm text-gray-400">{follower.username}</p>
                          {follower.mutualFollowers > 0 && (
                            <p className="text-xs text-gray-500">
                              {follower.mutualFollowers} mutual followers
                            </p>
                          )}
                        </div>
                        <Button
                          variant={follower.isFollowingBack ? "outline" : "default"}
                          size="sm"
                          className={`px-4 py-2 text-sm transition-all duration-200 ${
                            follower.isFollowingBack 
                              ? "border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white" 
                              : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-medium"
                          }`}
                        >
                          {follower.isFollowingBack ? "Following" : "Follow Back"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "following" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Following</h3>
                  <span className="text-sm text-gray-400">{userStats.following}</span>
                </div>
                <div className="space-y-3">
                  {following.map((user, index) => (
                    <Card key={index} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-black text-sm font-semibold">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-white text-base">{user.name}</h4>
                            {user.verified && (
                              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-black text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.category}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 text-sm border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                        >
                          Following
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "suggested" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Suggested for You</h3>
                  <UsersIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3 mb-6">
                  {suggestedUsers.map((user, index) => (
                    <Card key={index} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-orange-400 to-red-500 text-black text-sm font-semibold">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">{user.name}</h4>
                          <p className="text-sm text-gray-400">{user.username}</p>
                          <p className="text-xs text-gray-500">
                            {user.category} • {user.mutualFollowers} mutual followers
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="px-4 py-2 text-sm bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          <UserPlusIcon className="w-3 h-3 mr-1" />
                          Follow
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Discover More Section */}
                <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
                  <div className="text-center">
                    <UsersIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white mb-1">Discover More Creators</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Find podcast creators based on your interests
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                    >
                      Browse All
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "engagement" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Episode Engagement</h3>
                  <span className="text-sm text-gray-400">This Week</span>
                </div>
                
                {/* Engagement Cards */}
                <div className="space-y-6">
                  {podcastEngagement.map((episode, index) => (
                    <Card key={index} className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
                      {/* Episode Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                          <MicIcon className="w-4 h-4 text-black" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">{episode.episodeTitle}</h4>
                          <p className="text-sm text-gray-400">{episode.episodeNumber} • {episode.timeAgo}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <HeartIcon className="w-4 h-4 text-red-400" />
                            <span>{episode.totalLikes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircleIcon className="w-4 h-4 text-blue-400" />
                            <span>{episode.totalComments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Likes Section */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex -space-x-2">
                            {episode.likes.slice(0, 3).map((user, userIndex) => (
                              <Avatar key={userIndex} className="w-6 h-6 border-2 border-gray-800">
                                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-500 text-black text-xs font-semibold">
                                  {user.avatar}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {episode.totalLikes > 3 && (
                              <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                <span className="text-xs text-gray-300">+{episode.totalLikes - 3}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {episode.likes.length === 1 
                              ? `${episode.likes[0].name} liked this`
                              : episode.likes.length === 2
                              ? `${episode.likes[0].name} and ${episode.likes[1].name} liked this`
                              : `${episode.likes[0].name}, ${episode.likes[1].name} and ${episode.totalLikes - 2} others liked this`
                            }
                          </p>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="space-y-3">
                        {episode.comments.map((comment, commentIndex) => (
                          <div key={commentIndex} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-black text-xs font-semibold">
                                {comment.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 border border-gray-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-white text-sm">{comment.name}</span>
                                  <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                                </div>
                                <p className="text-sm text-gray-300">{comment.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {episode.totalComments > episode.comments.length && (
                          <Button variant="ghost" className="text-sm text-gray-400 hover:text-gray-300 p-0 h-auto">
                            View {episode.totalComments - episode.comments.length} more comments
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Weekly Engagement Summary */}
                <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 mt-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-white mb-1">This Week's Engagement</h4>
                    <p className="text-sm text-gray-400 mb-3">Your podcasts are growing!</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-400">42</div>
                        <div className="text-xs text-gray-500">New Likes</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-blue-400">13</div>
                        <div className="text-xs text-gray-500">Comments</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-400">156</div>
                        <div className="text-xs text-gray-500">New Plays</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
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