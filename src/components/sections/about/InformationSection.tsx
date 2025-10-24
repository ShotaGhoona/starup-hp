export default function InformationSection() {
  const companyInfo = [
    { label: 'Company Name', value: '株式会社STAR UP' },
    { 
      label: 'Address', 
      value: (
        <>
          京都府京都市上京区甲斐守町97<br />
          西陣産業創造會館109
        </>
      )
    },
    { label: 'Established', value: '2023年11月30日' },
    { label: 'Employees', value: '46人' },
    { label: 'Representative', value: '緒方勇斗' },
    { 
      label: 'Business', 
      value: (
        <>
          AIを活用した共同開発・新規事業開発<br />
          AIプロダクトの開発<br />
          製造業向けAI SaaS事業<br />
          人材紹介事業
        </>
      )
    },
    { label: 'License', value: '認可番号：26-ユ-300728' },
    { 
      label: 'Legal Advisor', 
      value: (
        <>
          HEROリーガルグループ<br />
          弁護士法人 淀屋橋・山上合同　大阪事務所
        </>
      )
    },
    { label: 'Tax Advisor', value: '赤松税務会計事務所' },
    { 
      label: 'Bank', 
      value: (
        <>
          京都銀行 本店営業部<br />
          京都中央信用金庫 西陣支店
        </>
      )
    },
    // 取引実績
    {
      label: 'Transaction History',
      value: (
        <>
          EYストラテジー・アンド・コンサルティング株式会社<br />
          株式会社NTTデータ<br />
          株式会社NTTドコモ<br />
          株式会社クロステック<br />
          株式会社チャンピオンコーポレーション<br />
          株式会社建設技術研究所<br />
          清水建設株式会社<br />
          住友電気工業株式会社<br />
          STUDYSWITCH株式会社<br />
          たから株式会社<br />
          東映アニメーション株式会社<br />
          ナビエース株式会社<br />
          ネットロック株式会社<br />
          前田建設工業株式会社<br />
          VISONAL株式会社<br />
          LINEヤフー株式会社<br />
        </>
      )
    }
  ]

  return (
    <section className="py-16 md:py-32 bg-white">
      <div className="max-w-[1500px] mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <p className="text-sm lg:text-base text-gray-600">
            私たちの会社情報をご覧いただけます。
          </p>
          <p className="text-2xl md:text-3xl lg:text-6xl">
            Discover who we are, what drives our innovation forward, and the vision that shapes our future.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-32">
          <div className="lg:col-span-3">
            <img src="/images/about/company.jpg" alt="company-info" className="w-full object-cover" />
          </div>
          <div className="space-y-8 md:space-y-12 lg:col-span-5">
            {companyInfo.map((info, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 md:pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                    <div className="md:col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 md:mb-0">
                        {info.label}
                    </h3>
                    </div>
                    <div className="md:col-span-3">
                    <div className="text-base md:text-lg text-gray-900 leading-relaxed">
                        {info.value}
                    </div>
                    </div>
                </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}