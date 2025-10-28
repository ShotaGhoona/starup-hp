import RecruitApplyFormSection from '@/components/sections/recruit/RecruitApplyFormSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: '採用応募フォーム | STAR UP',
  description: 'STAR UPの採用応募フォームです。あなたのスキルと情熱を私たちのチームで活かしませんか。',
}

export default function RecruitApplyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <RecruitApplyFormSection />
      <Footer />
    </div>
  )
}
