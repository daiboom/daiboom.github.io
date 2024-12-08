'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <section className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-start px-8 gap-4">
            <Link
              href="/webgl"
              className={`py-8 inline-flex items-center text-base tracking-tight
                ${
                  pathname.startsWith('/webgl')
                    ? 'text-black font-medium'
                    : 'text-gray-500 hover:text-black'
                }
                transition-colors duration-200`}
            >
              WEBGL
            </Link>
            <Link
              href="/career"
              className={`py-8 inline-flex items-center text-base tracking-tight
                ${
                  pathname.startsWith('/career')
                    ? 'text-black font-medium'
                    : 'text-gray-500 hover:text-black'
                }
                transition-colors duration-200`}
            >
              경력
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">{children}</main>
    </section>
  )
}
