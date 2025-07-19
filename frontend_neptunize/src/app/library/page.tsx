'use client'

import { useState } from 'react'
import { MoreHorizontal, Play, Download, Check } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

const downloadedPodcasts = [
  {
    id: 1,
    title: 'The Tim Ferriss Show',
    creator: 'Tim Ferriss',
    downloadTime: 'Downloaded 2 hours ago',
    size: '45.2 MB',
    avatar: 'TT',
    isDownloaded: true
  },
  {
    id: 2,
    title: 'Radiolab',
    creator: 'WNYC Studios',
    downloadTime: 'Downloaded yesterday',
    size: '32.8 MB',
    avatar: 'R',
    isDownloaded: true
  },
  {
    id: 3,
    title: 'This American Life',
    creator: 'This American Life',
    downloadTime: 'Downloaded 3 days ago',
    size: '58.1 MB',
    avatar: 'TA',
    isDownloaded: true
  }
]

const tabs = ['Downloaded', 'Saved', 'History']

const currentlyPlaying = {
  title: 'The Future of AI',
  creator: 'Tech Talks Daily',
  avatar: 'TF'
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Library</h1>
          <button className="p-2">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 ${
                index === activeTab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 0 && (
          <div className="px-4 py-4">
            {/* Downloaded Episodes Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Downloaded Episodes</h2>
              <button className="text-sm text-blue-600 font-medium">Manage</button>
            </div>

            {/* Downloaded Episodes List */}
            <div className="space-y-3 mb-8">
              {downloadedPodcasts.map((podcast) => (
                <div key={podcast.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center relative">
                        <span className="text-gray-600 text-sm font-medium">{podcast.avatar}</span>
                        {podcast.isDownloaded && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{podcast.title}</h3>
                        <p className="text-sm text-gray-500">{podcast.creator} • {podcast.downloadTime}</p>
                        <p className="text-xs text-gray-400">{podcast.size}</p>
                      </div>
                    </div>
                    <button className="p-2">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Storage Used</h3>
              <p className="text-center text-gray-600 mb-4">136.1 MB of 2 GB used</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '6.8%' }}></div>
              </div>
              
              <div className="text-center">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Manage Storage
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="px-4 py-8 text-center">
            <div className="bg-white rounded-xl p-8">
              <p className="text-gray-500 mb-4">No saved podcasts yet</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Explore Podcasts
              </button>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="px-4 py-8 text-center">
            <div className="bg-white rounded-xl p-8">
              <p className="text-gray-500 mb-4">No listening history yet</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Start Listening
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Currently Playing Bar */}
      <div className="bg-gray-800 px-4 py-3 mx-4 mb-20 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">{currentlyPlaying.avatar}</span>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">{currentlyPlaying.title}</h4>
              <p className="text-gray-400 text-xs">{currentlyPlaying.creator}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-1">
              <Play size={16} className="text-white" />
            </button>
            <div className="w-6 h-1 bg-gray-600 rounded">
              <div className="w-2 h-1 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
