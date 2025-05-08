'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav({tabs}) {
  const pathname = usePathname()



  return (
    <nav className="flex   ml-3 gap-3">
      {tabs.map(link => (
        <Link
          key={link.key}
          href={link.href}
          className={pathname === link.href ? 'bg-gray-200 text-sm px-3 py-1 rounded-sm' : 'text-gray-500 text-sm px-3 py-1 rounded-sm'}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
