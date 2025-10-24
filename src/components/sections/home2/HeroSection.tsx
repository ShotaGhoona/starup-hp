'use client'
import NetworkBackground from "@/components/animation/network-background/NetworkBackground"

export default function HeroSection() {
    return (
        <section className="relative h-screen overflow-hidden" data-bg="dark">
            {/* Background */}
            <div className="fixed inset-0 -z-1">
                <NetworkBackground className="w-full h-full"/>
            </div>
            <div className="max-w-[1500px] mx-auto flex items-end justify-start h-full w-full text-white">
                <div className="flex items-center">
                    <p className="text-8xl font-bold mr-6">STARUP</p>
                    <p className="text-6xl mr-6">with</p>
                    <div className="relative h-[100px] overflow-hidden">
                        <div className="word-carousel">
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Technology</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Product</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Design</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .word-carousel {
                    position: relative;
                    white-space: nowrap;
                    animation: move 4s infinite ease-in-out;
                    animation-delay: 0.5s;
                }
                
                @keyframes move {
                    0%   { transform: translateY(-300px); }
                    24%  { transform: translateY(-300px); }
                    25%  { transform: translateY(-200px); }
                    49%  { transform: translateY(-200px); }
                    50%  { transform: translateY(-100px); }
                    74%  { transform: translateY(-100px); }
                    75%  { transform: translateY(0); }
                    99%  { transform: translateY(0); }
                    100% { transform: translateY(100px); }
                }
            `}</style>
        </section>
    )
}