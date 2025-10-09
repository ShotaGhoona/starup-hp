'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Header = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mt-[54.79px] h-[100px] px-10">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-[50px] shadow-[4px_4px_20px_0px_rgba(0,0,0,0.1)] px-6 py-4">
            {/* ロゴ */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/icons/starup-logo.svg"
                alt="Starup Logo"
                width={60}
                height={35}
                className="w-[60px] h-[35px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header