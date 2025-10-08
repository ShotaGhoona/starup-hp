
import InteractiveParticleText from '@/components/animation/title-animation/InteractiveParticleText'
import { SpaceBackground } from '@/components/animation/background-animation'
import { MissionCard } from '@/components/ui'

const HeroSection = () => {
  return (
    <section className="relative max-w-7xl mx-auto">
      <div className="relative min-h-[100vh]">
        <SpaceBackground />
        
        {/* パーティクルテキストを左寄りに配置 */}
        <div className="absolute inset-0 flex items-center justify-start -translate-x-1/6">
          <div className="w-full h-[60rem]">
            <InteractiveParticleText className="w-full h-full" />
          </div>
        </div>
      </div>
      
      {/* MISSIONカードを下部に配置 */}
      <div className="flex justify-end items-end -translate-y-1/4">
        <MissionCard />
      </div>
    </section>
  )
}

export default HeroSection