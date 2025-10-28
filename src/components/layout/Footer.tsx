import TransitionLink from '@/components/ui/TransitionLink'
import Image from 'next/image'
import { companySNS } from '@/data/company'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-8 mb-16">
          {/* Contact & Career Buttons First */}
          <div className="space-y-4">
            <TransitionLink 
              href="/contact" 
              className="group flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-full hover:bg-orange-600 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <div className="bg-white text-orange-500 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">お気軽にご相談ください</p>

            <TransitionLink 
              href="/recruit" 
              className="group flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-full hover:bg-gray-900 transition-colors"
            >
              <span className="font-medium">Career</span>
              <div className="bg-white text-gray-800 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">一緒に働きませんか</p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Explore */}
            <div>
              <h3 className="text-base font-medium text-gray-500 mb-3">Explore</h3>
              <div className="space-y-2">
                <TransitionLink href="/about" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </TransitionLink>
                <TransitionLink href="/member" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Member
                </TransitionLink>
                <TransitionLink href="/news" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  News
                </TransitionLink>
                <TransitionLink href="/recruit" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Career
                </TransitionLink>
                <TransitionLink href="/contact" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </TransitionLink>
              </div>
            </div>

            {/* Follow us */}
            <div>
              <h3 className="text-base font-medium text-gray-500 mb-3">Follow us</h3>
              <div className="space-y-2">
                <a href={companySNS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @starup01
                </a>
                <a href={companySNS.note} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  starup01
                </a>
                <a href={companySNS.wantedly} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.833 3.477c-.832.367-1.51.617-2.033.75a3.743 3.743 0 00-1.216-.183c-.788 0-1.436.28-1.942.84-.398.438-.597 1.008-.597 1.712v1.383H6.2c-.061.333-.09.664-.09.99-.006 3.917 1.003 6.51 3.028 7.777 1.026.64 2.238.96 3.634.96.102 0 .196-.005.282-.013l.22.002h.098c.873.003 1.738-.16 2.59-.485l.028-.01v2.818l-.033.063c-.462.775-1.088 1.348-1.873 1.715-.788.367-1.678.55-2.673.55-1.198 0-2.296-.254-3.3-.764C4.764 21.6 3.75 20.71 2.825 19.435c-.927-1.277-1.39-2.69-1.39-4.225 0-1.21.265-2.304.79-3.28.523-.977 1.238-1.792 2.143-2.447.906-.653 1.958-1.097 3.16-1.33.28-.055.567-.098.858-.13.232-.023.456-.04.674-.048l.05-.002c1.432-1.134 3.105-1.702 5.015-1.702h.534l-.033.08c-.204.64-.37 1.195-.5 1.67l-.03.126h-.067c-.445 0-.855.047-1.23.139zm-1.78 10.828c-.995 0-1.81-.296-2.442-.886-.632-.59-.95-1.333-.95-2.228 0-.9.318-1.65.95-2.246.632-.597 1.447-.897 2.442-.897.998 0 1.817.3 2.453.9.636.6.955 1.352.955 2.243 0 .896-.319 1.634-.955 2.214-.636.577-1.455.867-2.453.867zm-1.792-8.577c-.454 0-.844.085-1.17.254-.327.17-.59.408-.79.713-.199.305-.3.664-.3 1.078 0 .413.101.772.3 1.077.2.305.463.544.79.713.326.17.716.254 1.17.254.457 0 .85-.085 1.18-.254.33-.17.596-.408.798-.713.2-.305.3-.664.3-1.077 0-.414-.1-.773-.3-1.078-.202-.305-.468-.544-.798-.713-.33-.17-.723-.254-1.18-.254z"/>
                  </svg>
                  Wantedly
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16 lg:mb-20">
          {/* Explore */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Explore</h3>
            <div className="space-y-2">
              <TransitionLink href="/about" className="block text-gray-600 hover:text-gray-900 transition-colors">
                About
              </TransitionLink>
              <TransitionLink href="/member" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Member
              </TransitionLink>
              <TransitionLink href="/news" className="block text-gray-600 hover:text-gray-900 transition-colors">
                News
              </TransitionLink>
              <TransitionLink href="/recruit" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Career
              </TransitionLink>
              <TransitionLink href="/contact" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </TransitionLink>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Follow us</h3>
            <div className="space-y-2">
              <a href={companySNS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @starup01
              </a>
              <a href={companySNS.note} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                starup01
              </a>
              <a href={companySNS.wantedly} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.833 3.477c-.832.367-1.51.617-2.033.75a3.743 3.743 0 00-1.216-.183c-.788 0-1.436.28-1.942.84-.398.438-.597 1.008-.597 1.712v1.383H6.2c-.061.333-.09.664-.09.99-.006 3.917 1.003 6.51 3.028 7.777 1.026.64 2.238.96 3.634.96.102 0 .196-.005.282-.013l.22.002h.098c.873.003 1.738-.16 2.59-.485l.028-.01v2.818l-.033.063c-.462.775-1.088 1.348-1.873 1.715-.788.367-1.678.55-2.673.55-1.198 0-2.296-.254-3.3-.764C4.764 21.6 3.75 20.71 2.825 19.435c-.927-1.277-1.39-2.69-1.39-4.225 0-1.21.265-2.304.79-3.28.523-.977 1.238-1.792 2.143-2.447.906-.653 1.958-1.097 3.16-1.33.28-.055.567-.098.858-.13.232-.023.456-.04.674-.048l.05-.002c1.432-1.134 3.105-1.702 5.015-1.702h.534l-.033.08c-.204.64-.37 1.195-.5 1.67l-.03.126h-.067c-.445 0-.855.047-1.23.139zm-1.78 10.828c-.995 0-1.81-.296-2.442-.886-.632-.59-.95-1.333-.95-2.228 0-.9.318-1.65.95-2.246.632-.597 1.447-.897 2.442-.897.998 0 1.817.3 2.453.9.636.6.955 1.352.955 2.243 0 .896-.319 1.634-.955 2.214-.636.577-1.455.867-2.453.867zm-1.792-8.577c-.454 0-.844.085-1.17.254-.327.17-.59.408-.79.713-.199.305-.3.664-.3 1.078 0 .413.101.772.3 1.077.2.305.463.544.79.713.326.17.716.254 1.17.254.457 0 .85-.085 1.18-.254.33-.17.596-.408.798-.713.2-.305.3-.664.3-1.077 0-.414-.1-.773-.3-1.078-.202-.305-.468-.544-.798-.713-.33-.17-.723-.254-1.18-.254z"/>
                </svg>
                Wantedly
              </a>
            </div>
          </div>

          {/* Empty column */}
          <div></div>

          {/* Contact & Career */}
          <div className="space-y-4">
            <TransitionLink 
              href="/contact" 
              className="group flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-full hover:bg-orange-600 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <div className="bg-white text-orange-500 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">お気軽にご相談ください</p>

            <TransitionLink 
              href="/recruit" 
              className="group flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-full hover:bg-gray-900 transition-colors mt-6"
            >
              <span className="font-medium">Career</span>
              <div className="bg-white text-gray-800 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">一緒に働きませんか</p>
          </div>
        </div>

      </div>
      
      {/* Large text logo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 max-w-[1500px] w-full px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <Image
            src="/icons/starup-logo.svg"
            alt="Starup Logo"
            width={120}
            height={120}
            className="w-[4rem] h-[4rem] md:w-[8rem] md:h-[8rem] lg:w-[12rem] lg:h-[12rem] xl:w-[16rem] xl:h-[16rem]"
          />
          <h1 className="font-black text-gray-900 leading-none tracking-tight whitespace-nowrap" style={{fontSize: 'clamp(4rem, 8vw, 20rem)'}}>
            STARUP
          </h1>
        </div>
      </div>
    </footer>
  )
}