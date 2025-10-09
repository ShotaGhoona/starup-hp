import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const navigationLinks = [
    { name: 'SERVICE', href: '#service' },
    { name: 'BOARD MEMBER', href: '#board' }, 
    { name: 'NEWS', href: '#news' },
    { name: 'CAREERS', href: '#careers' },
    { name: 'COMPANY', href: '#company' },
    { name: 'PRESS KIT', href: '#press' },
    { name: 'PRIVACY POLICY', href: '#privacy' }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Image 
                src="/icons/starup-logo.svg" 
                alt="STARUP Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                STAR UP
              </span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-sm">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <span className="text-sm">in</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-200">Navigation</h3>
            <nav className="space-y-3">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Office info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 text-blue-200">Office</h3>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold text-blue-200 mb-2">京都本社</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  〒600-8216<br />
                  京都府京都市下京区東塩小路町735-1<br />
                  京阪京都ビル4階
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold text-blue-200 mb-2">東京支社</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  〒107-0052<br />
                  東京都港区赤坂9-7-1<br />
                  ミッドタウン・タワー31階
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © 2024 STARUP Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;