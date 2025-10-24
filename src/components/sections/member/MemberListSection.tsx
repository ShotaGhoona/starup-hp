'use client'
import { memberData } from "@/data/member/member";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MemberListSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach((card, index) => {
      const image = card.querySelector('.member-image');
      const position = card.querySelector('.member-position');
      const name = card.querySelector('.member-name');
      const englishName = card.querySelector('.member-english-name');
      const description = card.querySelector('.member-description');
      const learnMore = card.querySelector('.member-learn-more');

      // 初期状態を設定
      gsap.set(image, { opacity: 0, x: -30 });
      gsap.set(position, { opacity: 0, y: 20 });
      gsap.set(name, { opacity: 0, y: 20 });
      gsap.set(englishName, { opacity: 0, y: 20 });
      gsap.set(description, { opacity: 0, y: 30 });
      gsap.set(learnMore, { opacity: 0, y: 20 });

      // スクロールアニメーション
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(image, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" })
        .to(position, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.3")
        .to(name, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .to(englishName, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1")
        .to(description, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .to(learnMore, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.1");
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <p className="text-sm lg:text-base text-gray-600">革新的な発想と確かな技術力を持つメンバーで、未来のテクノロジーを創造しています</p>
          <p className="text-3xl lg:text-6xl">
            Where brilliant minds converge to create the future. Meet the architects of tomorrow's technology revolution.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {memberData.map((member, index) => (
            <div 
              key={member.id} 
              className="member-card bg-white overflow-hidden transition-shadow duration-300 h-80"
            >
              <div className="flex h-full">
                {/* Left side - Image */}
                <div className="member-image aspect-square h-80 w-60 relative mr-4">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Vertical line */}
                <div className="w-px bg-gray-200"></div>
                
                {/* Right side - Content */}
                <div className="flex-1 p-6 flex flex-col justify-between relative">
                  {/* Top section */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="member-position text-xs font-medium text-gray-600">
                        {member.position}
                      </p>
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="member-name text-lg font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        {member.englishName && (
                          <p className="member-english-name text-sm text-gray-500">
                            {member.englishName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* SNS Icons - Top right */}
                    {member.socialLinks && (
                      <div className="flex gap-2">
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a
                            href={member.socialLinks.facebook}
                            className="text-gray-400 hover:text-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom section */}
                  <div className="flex flex-col items-end">
                    {/* Description - Bottom left */}
                    <p className="member-description text-xs text-gray-600 leading-relaxed flex-1 mr-4">
                      {member.description.length > 200 
                        ? `${member.description.substring(0, 100)}...`
                        : member.description
                      }
                    </p>
                    
                    {/* View More - Bottom right */}
                    <button className="member-learn-more text-xs text-gray-800 hover:text-black transition-colors font-medium flex items-center gap-1">
                      Learn More
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}