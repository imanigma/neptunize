'use client'

import { Home, Mic, Search, Bookmark } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/generate', icon: Mic, label: 'Generate' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/library', icon: Bookmark, label: 'Library' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="mb-1" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
