import { BookmarkIcon, MicIcon, SearchIcon, MoreHorizontalIcon, HomeIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

interface HomeProps {
  onNavigate: (screen: string) => void;
}

export const Home = ({ onNavigate }: HomeProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState("followers");

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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Container */}
        <div className="flex flex-col h-[844px] relative">
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-medium text-gray-800">Home</h1>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontalIcon className="w-4 h-4 text-gray-600" />
            </Button>
          </header>

          {/* User Profile Section */}
          <div className="p-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gray-800 text-white text-lg font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-800">Your Profile</h2>
                <p className="text-sm text-gray-600">@yourpodcast</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-around py-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{userStats.podcasts}</div>
                <div className="text-xs text-gray-600">Podcasts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{userStats.followers.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{userStats.following}</div>
                <div className="text-xs text-gray-600">Following</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-white">
            {[
              { id: "followers", label: "Followers" },
              { id: "following", label: "Following" },
              { id: "suggested", label: "Suggested" },
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
            {activeTab === "followers" && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Your Followers</h3>
                  <span className="text-sm text-gray-500">{userStats.followers.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {followers.map((follower, index) => (
                    <Card key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                            {follower.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-base">{follower.name}</h4>
                          <p className="text-sm text-gray-600">{follower.username}</p>
                          {follower.mutualFollowers > 0 && (
                            <p className="text-xs text-gray-500">
                              {follower.mutualFollowers} mutual followers
                            </p>
                          )}
                        </div>
                        <Button
                          variant={follower.isFollowingBack ? "outline" : "default"}
                          size="sm"
                          className={`px-4 py-2 text-sm ${
                            follower.isFollowingBack 
                              ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                              : "bg-gray-800 text-white hover:bg-gray-700"
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
                  <h3 className="text-lg font-medium text-gray-800">Following</h3>
                  <span className="text-sm text-gray-500">{userStats.following}</span>
                </div>
                <div className="space-y-3">
                  {following.map((user, index) => (
                    <Card key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium text-gray-800 text-base">{user.name}</h4>
                            {user.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.category}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  <h3 className="text-lg font-medium text-gray-800">Suggested for You</h3>
                  <UsersIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3 mb-6">
                  {suggestedUsers.map((user, index) => (
                    <Card key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-base">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.username}</p>
                          <p className="text-xs text-gray-500">
                            {user.category} • {user.mutualFollowers} mutual followers
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="px-4 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700"
                        >
                          <UserPlusIcon className="w-3 h-3 mr-1" />
                          Follow
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Discover More Section */}
                <Card className="bg-gray-50 rounded-lg p-4 border-0">
                  <div className="text-center">
                    <UsersIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-800 mb-1">Discover More Creators</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Find podcast creators based on your interests
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-white"
                    >
                      Browse All
                    </Button>
                  </div>
                </Card>
              </div>
            )}
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