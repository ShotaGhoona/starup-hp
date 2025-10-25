import RecruitListSection from '@/components/sections/recruit/RecruitListSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getAllRecruitsForList } from '@/lib/recruit'

export default function RecruitPage() {
  const recruits = getAllRecruitsForList()

  return (
    <div className="min-h-screen">
      <Header />
      <RecruitListSection recruits={recruits} />
      <Footer />
    </div>
  )
}
