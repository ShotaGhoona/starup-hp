import Header from "@/components/layout/Header"
import ContactSection from "@/components/sections/home/ContactSection"
import Footer from "@/components/layout/Footer"
export default function ContactPage() {
  return (
    <div>
      <Header />
      <div className="mt-20 md:mt-40">
        <ContactSection />

      </div>
      <Footer />
    </div>
  )
}