import FaithfulParticleText from '@/components/animation/title-animation/FaithfulParticleText'
import { SpaceBackground } from '@/components/animation/background-animation'
import { MissionCard } from '@/components/ui'

const HeroSection = () => {
  return (
    <section className="relative max-w-7xl mx-auto">
      <div className="min-h-[80vh]">
        <SpaceBackground />
        <FaithfulParticleText 
          className="w-full h-[80vh]"
          config={{}}
        />
      </div>
      
      {/* MISSIONカードを下部に配置 */}
      <div className="flex justify-start items-end -translate-y-1/4">
        <MissionCard />
      </div>
    </section>
  )
}

export default HeroSection