# セクションを跨ぐ背景の実装方法

## 方法1: ページレベルでの背景管理（推奨）

各ページで背景を直接管理する方法。最もシンプルで直感的。

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
    </div>
  )
}
```

## 方法2: PageWrapperコンポーネント

ページごとに異なる背景を管理したい場合。

```tsx
// components/layout/PageWrapper.tsx
export default function PageWrapper({ 
  children, 
  backgroundType = 'default' 
}) {
  const bgClass = {
    home: 'bg-gradient-to-b from-blue-50 via-white to-gray-50',
    about: 'bg-gradient-to-r from-gray-50 to-blue-50',
    contact: 'bg-white'
  }
  
  return (
    <div className={bgClass[backgroundType]}>
      {children}
    </div>
  )
}
```

使用例：
```tsx
// app/page.tsx
import PageWrapper from '@/components/layout/PageWrapper'

export default function HomePage() {
  return (
    <PageWrapper backgroundType="home">
      <HeroSection />
      <FeaturesSection />
    </PageWrapper>
  )
}
```

## 方法3: CSS変数での管理

複雑な背景やアニメーションが必要な場合。

```css
/* app/globals.css */
.page-home {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  min-height: 100vh;
}

.page-about {
  background: radial-gradient(circle at top, #dbeafe 0%, #ffffff 50%);
  min-height: 100vh;
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div className="page-home">
      <HeroSection />
      <FeaturesSection />
    </div>
  )
}
```

## 注意点

- セクション内で背景を設定すると途中で区切れる
- ページ全体で統一感を保つため、ページレベルで管理する
- 複数ページで同じ背景を使う場合は、PageWrapperコンポーネントを活用