import InteractiveParticleText from '@/components/animation/title-animation/InteractiveParticleText'

export default function TestPage() {
  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* パーティクルテキスト */}
        <InteractiveParticleText className="w-full h-full" />
      </div>
    </div>
  )
}