import { notFound } from 'next/navigation'
import { getAllRecruitPostSlugs, getRecruitPostBySlug } from '@/lib/mdx'
import { getAllRecruitsForList } from '@/lib/recruit'
import RecruitDetailContentSection from '@/components/sections/recruit/RecruitDetailContentSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface RecruitPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const slugs = getAllRecruitPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function RecruitPostPage({ params }: RecruitPostPageProps) {
  const { slug } = await params

  try {
    const post = getRecruitPostBySlug(slug)
    const allRecruits = getAllRecruitsForList()

    return (
      <div className="min-h-screen">
        <Header />
        <RecruitDetailContentSection post={post} allRecruits={allRecruits} />
        <Footer />
      </div>
    )
  } catch {
    notFound()
  }
}
