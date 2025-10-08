# パーティクルテキストアニメーション 使用例

## 基本的な使用方法

```tsx
import FaithfulParticleText from '@/components/animation/title-animation/FaithfulParticleText'

// デフォルト設定で使用
<FaithfulParticleText className="w-full h-screen" />
```

## カスタム設定での使用

```tsx
import FaithfulParticleText from '@/components/animation/title-animation/FaithfulParticleText'

// パラメータをカスタマイズ
<FaithfulParticleText 
  className="w-full h-screen"
  config={{
    text: {
      content: 'CUSTOM TEXT\nSECOND LINE',
      size: 12,
      lineSpacing: 15,
    },
    particle: {
      amount: 400,
      baseSize: 3,
      initialSize: 2,
    },
    colors: {
      base: { h: 0.6, s: 1, l: 0.5 }, // 青色
      interaction: { h: 0.1, s: 1, l: 0.6 }, // オレンジ色
    },
    animation: {
      area: 300,
      easeNormal: 0.08,
    }
  }}
/>
```

## 設定可能なパラメータ

### テキスト設定
- `text.content`: 表示するテキスト（改行は\nで指定）
- `text.size`: フォントサイズ
- `text.lineSpacing`: 行間の隙間

### パーティクル設定
- `particle.amount`: パーティクル数（アウトラインの太さに影響）
- `particle.baseSize`: 基本パーティクルサイズ
- `particle.initialSize`: 初期生成時サイズ

### 色設定（HSL形式）
- `colors.base`: 基本色（h: 色相, s: 彩度, l: 明度）
- `colors.interaction`: インタラクション時の色

### アニメーション設定
- `animation.area`: マウス影響範囲
- `animation.easeNormal`: 通常時の復元速度
- `animation.easePressed`: クリック時の復元速度

## 微調整のコツ

### アウトラインを細くしたい場合
```tsx
config={{
  particle: {
    amount: 200, // パーティクル数を減らす
    baseSize: 1.5, // サイズを小さく
  }
}}
```

### 動きを早くしたい場合
```tsx
config={{
  animation: {
    easeNormal: 0.1, // 復元速度を上げる
    area: 200, // 影響範囲を狭く
  }
}}
```

### 色を変更したい場合
```tsx
config={{
  colors: {
    base: { h: 0.33, s: 1, l: 0.4 }, // 緑色
    interaction: { h: 0.83, s: 1, l: 0.6 }, // 紫色
  }
}}
```