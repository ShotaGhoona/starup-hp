export interface Member {
    id: string
    name: string
    englishName?: string
    position: string
    description: string
    image?: string
    socialLinks?: {
      twitter?: string
      facebook?: string
      linkedin?: string
    }
  }
  
  export const memberData: Member[] = [
    {
      id: "yuto-ogata",
      name: "緒方 勇斗",
      englishName: "Yuto Ogata",
      position: "代表取締役",
      description:
        "京都大学在学中に教育メディアの会社を大学1年時立ち上げ後、製造業の営業コンサル、商社の新規事業部でのPM、人材会社でのCSを経験。その後、昨年11月に株式会社STARUPを設立し、12ヶ月でメンバーも40名まで拡大させる。",
      image: "/images/member/ogata-yuto.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "kokomu-matsuo",
      name: "松尾心夢",
      englishName: "Kokomu Matsuo",
      position: "取締役",
      description:
        "京都大学経済学部出身。教育系スタートアップにてCSOや新規事業開発責任者やシステム開発会社でAIを活用した業務改善ツールの開発やプロダクト化を経験したのちに、CEOの緒方と株式会社STAR UPを共同創業する。",
      image: "/images/member/matsuo-kokomu.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "takehiro-kikkawa",
      name: "吉川岳宏",
      englishName: "Takehiro Kikkawa",
      position: "取締役",
      description:
        "データサイエンス系ベンチャーにて非財務情報の開示やバックオフィス改善業務に従事。また、大学別の環境報告書の作成や飲食店のGHG排出量の開示等のPJを行う。",
      image: "/images/member/kikkawa-takehiro.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "hachiki-ikeda",
      name: "池田八輝",
      englishName: "Hachiki Ikeda",
      position: "執行役員",
      description:
        "受託開発事業部の統括と主に物流部門のプロジェクトを担当。「倉庫シェアリングサービスのマッチングモデルの構築」「特殊車両経路選択モデルの構築」などの物流システムの研究を経て、「需要予測ツールの開発」や「配送経路最適化ツール」の開発に取り組んでいる。",
      image: "/images/member/ikeda-hatchiki.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "yuki-tanaka",
      name: "田中祐希",
      englishName: "Yuki Tanaka",
      position: "執行役員/最高技術責任者",
      description:
        "大手IT企業をはじめとする3社にてPM・リードエンジニアを経験した後フリーランスエンジニアとして数十件の案件に携わる。生成AIを活用した新規事業立ち上げ、業務効率化、システム開発などを経験する。",
      image: "/images/member/tanaka-yuki.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "daigo-fujii",
      name: "藤井大悟",
      englishName: "Daigo Fujii",
      position: "執行役員",
      description:
        "京都大学経済学部出身。京都のスタートアップで事業開発を行ったのち、上場企業のM&A・アライアンス部署でソーシングや出資・協業検討を行う。STARUPでは、2度の銀行調達など経理・ファイナンスの統括を担当。",
      image: "/images/member/fuji-daigo.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "naoki-kadokura",
      name: "門倉尚紀",
      englishName: "Naoki Kadokura",
      position: "執行役員",
      description:
        "京都大学大学院出身。メガベンチャーのデータサイエンティストとして従事しつつ、京大在学中に京大エンジニアサークル5スキップを立ち上げメンバーを120人まで拡大させる。STAR UPではSaaSの立ち上げを行い、現在は受託開発部門の統括を担当。",
      image: "/images/member/kadokura-naoki.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "haruki-kimura",
      name: "木村遥輝",
      englishName: "Haruki Kimura",
      position: "ARCHAIVE事業部 営業責任者",
      description:
        "京都大学工学部出身。在学時には、新規事業開発、人材事業での営業・CSを経験。STARUPではSaaS事業の立ち上げを行い、現在は営業組織構築や販売戦略立案など営業の統括を担当。",
      image: "/images/member/kimura-haruki.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "takuma-tsuji",
      name: "辻拓真",
      englishName: "Takuma Tsuji",
      position: "ARCHAIVE事業部 CS責任者",
      description:
        "京都大学教育学部出身。大学では生涯教育に関して研究。2社でインターン経験を積んだのち、STAR UPに参画。SaaS事業の営業・展示会マーケ・カスタマーサクセス・事業開発・そして採用などにも幅広く携わる。",
      image: "/images/member/tsuji-takuma.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "sho-takada",
      name: "高田尚",
      englishName: "Sho Takada",
      position: "受託開発事業部 PM",
      description:
        "京都大学教育学部出身。在学中に大喜利AIを個人開発しながら、営業インターンにも携わる。面白さが形になっていく過程に惹かれ、株式会社STARUPに参画。現在はPMとして需要予測ツールの開発を推進している。",
      image: "/images/member/takada-sho.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "takumi-kodama",
      name: "小玉拓未",
      englishName: "Takumi Kodama",
      position: "コーポレート",
      description:
        "京都大学理学部出身。大学では細胞生物学を研究。STAR UP参画後は、広報として当HPやSaaS LP、記事の作成等を行い、受託開発や経理、人材事業といった業務にも携わる。",
      image: "/images/member/kodama-takumi.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "rick-huang",
      name: "ファンリック",
      englishName: "Rick Huang",
      position: "VPoE",
      description:
        "量子技術の世界的研究機関でのインターンやテック系スタートアップの創業と成長に従事。日本語と英語の両方に堪能であり、量子・ソフトウェア・AI開発など幅広い分野に知見をもつ。",
      image: "/images/member/huang-rick.png",
      socialLinks: { twitter: "#", facebook: "#", linkedin: "#" }
    }
  ]
  