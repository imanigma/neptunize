'use client'

import { useState } from 'react'
import { Search as SearchIcon, Mic, MoreHorizontal } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

const trendingPodcasts = [
  {
    id: 1,
    title: 'Tech Talk Weekly',
    category: 'Technology',
    plays: '2.4M plays',
    icon: '🎤'
  },
  {
    id: 2,
    title: 'Business Insights',
    category: 'Business',
    plays: '1.8M plays',
    icon: '🎤'
  },
  {
    id: 3,
    title: 'Health & Wellness',
    category: 'Health',
    plays: '1.2M plays',
    icon: '🎤'
  }
]

const categories = [
  { name: 'Technology', icon: '💻', emoji: '💻' },
  { name: 'Business', icon: '💼', emoji: '💼' },
  { name: 'Health', icon: '🏥', emoji: '🏥' },
  { name: 'Education', icon: '📚', emoji: '📚' }
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Search</h1>
          <button className="p-2">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="relative">
          <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search podcasts, creators, topics..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Trending Now */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Now</h2>
          <div className="space-y-3">
            {trendingPodcasts.map((podcast) => (
              <div key={podcast.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Mic size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{podcast.title}</h3>
                    <p className="text-sm text-gray-500">{podcast.category} • {podcast.plays}</p>
                  </div>
                </div>
                <button className="p-2">
                  <MoreHorizontal size={16} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {category.emoji}
                </div>
                <span className="font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* From Your Network */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">From Your Network</h2>
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-500 mb-4">No podcasts from your network yet</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Invite Friends
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
