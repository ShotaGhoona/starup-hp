import Link from 'next/link'
import Image from 'next/image'

export default function Footer2() {
  return (
    <footer className="bg-gray-100 py-16 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {/* Explore */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/service" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Service
              </Link>
              <Link href="/news" className="block text-gray-600 hover:text-gray-900 transition-colors">
                News
              </Link>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Follow us</h3>
            <div className="space-y-2">
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @starup_official
              </Link>
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                STARUP Inc.
              </Link>
              <Link href="#" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                starup_tech
              </Link>
            </div>
          </div>

          {/* Empty column */}
          <div></div>

          {/* Contact & Career */}
          <div className="space-y-4">
            <Link 
              href="/contact" 
              className="group flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-full hover:bg-orange-600 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <div className="bg-white text-orange-500 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
            <p className="text-sm text-gray-500">お気軽にご相談ください</p>

            <Link 
              href="/career" 
              className="group flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-full hover:bg-gray-900 transition-colors mt-6"
            >
              <span className="font-medium">Career</span>
              <div className="bg-white text-gray-800 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
            <p className="text-sm text-gray-500">一緒に働きませんか</p>
          </div>
        </div>

      </div>
      
      {/* Large text logo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 max-w-[1500px] w-full">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/icons/starup-logo.svg"
            alt="Starup Logo"
            width={120}
            height={120}
            className="w-[8rem] h-[8rem] md:w-[12rem] md:h-[12rem] lg:w-[16rem] lg:h-[16rem]"
          />
          <h1 className="font-black text-gray-900 leading-none tracking-tight whitespace-nowrap" style={{fontSize: 'clamp(8rem, 12vw, 20rem)'}}>
            STARUP
          </h1>
        </div>
      </div>
    </footer>
  )
}