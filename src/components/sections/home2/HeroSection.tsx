import NetworkBackground from "@/components/animation/network-background/NetworkBackground"

export default function HeroSection() {
    return (
        <section className="relative h-screen overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0">
                <NetworkBackground className="w-full h-full"/>
            </div>
            
            {/* Text Logo at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 lg:px-16 z-10">
                <h1 
                    className="text-[20vw] font-serif tracking-widest uppercase text-center"
                    style={{
                        backgroundImage: "linear-gradient(70deg,rgb(255, 255, 255) 0%,rgb(115, 231, 246) 60%,rgb(238, 133, 236) 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: "1",
                        marginBottom: "-0.1em",
                    }}
                >
                    STARUP
                </h1>
            </div>
        </section>
    )
}