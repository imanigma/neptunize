'use client'

interface Follower {
  id: number
  name: string
  username: string
  avatar: string
  mutualFollowers: number
  isFollowing: boolean
}

interface FollowerCardProps {
  follower: Follower
}

export function FollowerCard({ follower }: FollowerCardProps) {
  return (
    <div className="px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">{follower.avatar}</span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{follower.name}</div>
          <div className="text-sm text-gray-500">{follower.username}</div>
          <div className="text-xs text-gray-400">{follower.mutualFollowers} mutual followers</div>
        </div>
      </div>
      
      <button 
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          follower.isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {follower.isFollowing ? 'Following' : 'Follow Back'}
      </button>
    </div>
  )
}
