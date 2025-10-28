'use client'
import NetworkBackground from "@/components/animation/network-background/NetworkBackground"

export default function HeroSection() {
    return (
        <section className="relative h-screen min-h-[100dvh] overflow-hidden" data-bg="dark">
            {/* Background */}
            <div className="fixed inset-0">
                <NetworkBackground className="w-full h-full"/>
            </div>

            {/* 下半分のタッチイベントをブロックするオーバーレイ */}
            <div className="block lg:hidden fixed inset-0 top-1/2 pointer-events-auto z-[5]"
                 style={{ touchAction: 'pan-y' }} />

            <div className="max-w-[1500px] mx-auto flex items-end justify-start h-full w-full text-white relative z-10 pointer-events-none px-4">
                {/* Mobile Layout */}
                <div className="block lg:hidden w-full pb-20 pt-16">
                    <div className="absolute bottom-0 right-0 w-full h-[50vh]">
                    </div>
                    <div className="flex flex-col space-y-4">
                        <p className="text-4xl md:text-5xl font-bold">STARUP</p>
                        <p className="text-3xl md:text-4xl">with</p>
                        <div className="relative h-[60px] md:h-[80px] overflow-hidden">
                            <div className="word-carousel-mobile">
                                <span className="block h-[60px] md:h-[80px] leading-[60px] md:leading-[80px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Technology</span>
                                <span className="block h-[60px] md:h-[80px] leading-[60px] md:leading-[80px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
                                <span className="block h-[60px] md:h-[80px] leading-[60px] md:leading-[80px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Product</span>
                                <span className="block h-[60px] md:h-[80px] leading-[60px] md:leading-[80px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Design</span>
                                <span className="block h-[60px] md:h-[80px] leading-[60px] md:leading-[80px] text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">You</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center">
                    <p className="text-8xl font-bold mr-6">STARUP</p>
                    <p className="text-6xl mr-6">with</p>
                    <div className="relative h-[100px] overflow-hidden">
                        <div className="word-carousel">
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Technology</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Product</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Design</span>
                            <span className="block h-[100px] leading-[100px] text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">You</span>
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
                
                .word-carousel-mobile {
                    position: relative;
                    white-space: nowrap;
                    animation: moveMobile 4s infinite ease-in-out;
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
                
                @keyframes moveMobile {
                    0%   { transform: translateY(-180px); }
                    24%  { transform: translateY(-180px); }
                    25%  { transform: translateY(-120px); }
                    49%  { transform: translateY(-120px); }
                    50%  { transform: translateY(-60px); }
                    74%  { transform: translateY(-60px); }
                    75%  { transform: translateY(0); }
                    99%  { transform: translateY(0); }
                    100% { transform: translateY(60px); }
                }
                
                @media (min-width: 768px) and (max-width: 1023px) {
                    @keyframes moveMobile {
                        0%   { transform: translateY(-240px); }
                        24%  { transform: translateY(-240px); }
                        25%  { transform: translateY(-160px); }
                        49%  { transform: translateY(-160px); }
                        50%  { transform: translateY(-80px); }
                        74%  { transform: translateY(-80px); }
                        75%  { transform: translateY(0); }
                        99%  { transform: translateY(0); }
                        100% { transform: translateY(80px); }
                    }
                }
            `}</style>
        </section>
    )
}