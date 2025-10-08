// パーティクルテキストアニメーション設定
export const PARTICLE_TEXT_CONFIG = {
  // テキスト設定
  text: {
    content: '頭脳集団 × AI\nSTAR UP',
    size: 8,
    lineSpacing: 20, // 行間の隙間（小さいほど狭い）
  },

  // パーティクル設定
  particle: {
    amount: 300, // パーティクル数（少ないほど細いアウトライン）
    baseSize: 1, // 基本パーティクルサイズ
    initialSize: 1, // 初期生成時サイズ
  },

  // 色設定（HSL形式）
  colors: {
    base: {
      h: 0, // 色相（0-1）
      s: 0, // 彩度（0-1）
      l: 0, // 明度（0-1）黒色
    },
    interaction: {
      h: 0.15, // 色相（黄色）
      s: 1.0, // 彩度
      l: 0.5, // 明度
    },
  },

  // アニメーション設定
  animation: {
    area: 250, // マウス影響範囲
    easeNormal: 0.05, // 通常時の復元速度
    easePressed: 0.01, // クリック時の復元速度
  },

  // カメラ設定
  camera: {
    fov: 65, // 視野角
    position: {
      x: 0,
      y: 0,
      z: 100,
    },
  },

  // レンダラー設定
  renderer: {
    clearColor: 0x000000, // 背景色（透明）
    alpha: true,
    antialias: true,
  },

  // フォント設定
  fonts: {
    urls: [
      '/fonts/Noto Sans JP_Regular.json', // 日本語フォント
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/optimer_regular.typeface.json',
      'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
      'https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json',
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    ],
  },

  // パーティクルテクスチャ
  texture: {
    url: 'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png',
  },

  // インタラクション設定
  interaction: {
    clickForce: 70, // クリック時の移動範囲
    hoverForce: 10, // ホバー時の移動範囲
    attractionStrength: 0.03, // 引力の強さ
    repulsionDivider: 1.2, // 反発パーティクルサイズ調整
    attractionMultiplier: 1.3, // 引力パーティクルサイズ調整
    distanceMultiplier: 1.8, // 距離パーティクルサイズ調整
  },
} as const

// 設定のタイプ定義
export type ParticleTextConfig = typeof PARTICLE_TEXT_CONFIG