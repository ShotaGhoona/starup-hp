import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const navigationLinks = [
    'SERVICE',
    'BOARD MEMBER', 
    'NEWS',
    'CAREERS',
    'COMPANY',
    'PRESS KIT',
    'PRIVACY POLICY'
  ];

  return (
    <footer style={{background: 'linear-gradient(to right, #0B13BB, #405FA3)'}} className="text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Logo - center top */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image 
            src="/icons/starup-logo.svg" 
            alt="STARUP Logo" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          <span className="text-xl font-bold">STAR UP</span>
        </div>
        
        {/* Addresses - 2 column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Kyoto office - left */}
          <div className="text-sm">
            <p className="font-semibold mb-2">京都本社</p>
            <p>〒600-8216 京都府京都市下京区東塩小路町735-1</p>
            <p>京阪京都ビル4階</p>
          </div>
          
          {/* Tokyo office - right */}
          <div className="text-sm">
            <p className="font-semibold mb-2">東京支社</p>
            <p>〒107-0052 東京都港区赤坂9-7-1</p>
            <p>ミッドタウン・タワー31階</p>
          </div>
        </div>

        {/* Navigation links - horizontal center */}
        <div className="flex justify-center mb-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-sm hover:opacity-80 transition-opacity duration-200 whitespace-nowrap"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Copyright - bottom center */}
        <div className="text-center">
          <p className="text-sm">© STARUP Inc All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;