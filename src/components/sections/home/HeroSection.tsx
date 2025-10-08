import FaithfulParticleText from '@/components/animation/title-animation/FaithfulParticleText'
import { SpaceBackground } from '@/components/animation/background-animation'

const HeroSection = () => {
  return (
    <section className="relative min-h-screen">
      <SpaceBackground />
      <FaithfulParticleText 
        className="w-full h-screen -translate-x-1/6"
        config={{}}
      />
    </section>
  )
}

export default HeroSection