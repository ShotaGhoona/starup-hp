export interface ServiceCardOption {
  id: number
  title: string
  subtitle: string
  backgroundImage: string
  defaultColor: string
}

export interface ServiceCategory {
  id: string
  title: string
  cards: ServiceCardOption[]
}

export const serviceData: ServiceCategory[] = [
  {
    id: "saas",
    title: "SaaS開発",
    cards: [
      {
        id: 1,
        title: "AI駆動型開発",
        subtitle: "最先端のAI技術を活用したSaaS構築",
        backgroundImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#3B82F6"
      },
      {
        id: 2,
        title: "スケーラブル設計",
        subtitle: "成長に対応できる柔軟なアーキテクチャ",
        backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#10B981"
      },
      {
        id: 3,
        title: "クラウドネイティブ",
        subtitle: "AWS・GCP・Azureでの最適化",
        backgroundImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#8B5CF6"
      },
      {
        id: 4,
        title: "高速開発",
        subtitle: "アジャイル手法による迅速な価値提供",
        backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#F59E0B"
      }
    ]
  },
  {
    id: "contract",
    title: "受託開発・共同開発",
    cards: [
      {
        id: 1,
        title: "フルスタック開発",
        subtitle: "企画から運用まで一貫したサポート",
        backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#DC2626"
      },
      {
        id: 2,
        title: "専門チーム",
        subtitle: "経験豊富なエンジニアによる開発",
        backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#059669"
      },
      {
        id: 3,
        title: "AI・機械学習",
        subtitle: "データ活用による価値創出",
        backgroundImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#7C3AED"
      },
      {
        id: 4,
        title: "レガシー刷新",
        subtitle: "既存システムのモダナイゼーション",
        backgroundImage: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        defaultColor: "#EA580C"
      }
    ]
  }
]