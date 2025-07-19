'use client'

import { MoreHorizontal, User } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { FollowerCard } from '@/components/FollowerCard'

// Mock data to match your screenshots
const profileData = {
  name: 'Your Profile',
  username: '@yourpodcast',
  podcasts: 12,
  followers: 1247,
  following: 89,
  avatar: 'U'
}

const followers = [
  {
    id: 1,
    name: 'Alex Thompson',
    username: '@alexthompson',
    avatar: 'AT',
    mutualFollowers: 5,
    isFollowing: true
  },
  {
    id: 2,
    name: 'Sarah Chen',
    username: '@sarahchen',
    avatar: 'SC',
    mutualFollowers: 12,
    isFollowing: false
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    username: '@mikerod',
    avatar: 'MR',
    mutualFollowers: 3,
    isFollowing: true
  },
  {
    id: 4,
    name: 'Emma Wilson',
    username: '@emmawilson',
    avatar: 'EW',
    mutualFollowers: 8,
    isFollowing: false
  },
  {
    id: 5,
    name: 'David Kim',
    username: '@davidkim',
    avatar: 'DK',
    mutualFollowers: 2,
    isFollowing: true
  }
]

const tabs = ['Followers', 'Following', 'Engagement', 'Suggested']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Home</h1>
          <button className="p-2">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-semibold">{profileData.avatar}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{profileData.name}</h2>
            <p className="text-gray-500">{profileData.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profileData.podcasts}</div>
            <div className="text-sm text-gray-500">Podcasts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profileData.followers.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profileData.following}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                index === 0
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Followers List */}
      <div className="bg-white">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Followers</h3>
            <span className="text-sm text-gray-500">{profileData.followers.toLocaleString()}</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {followers.map((follower) => (
            <FollowerCard key={follower.id} follower={follower} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
