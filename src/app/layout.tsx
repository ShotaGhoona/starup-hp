import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/layout/PageTransition";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const alliance = localFont({
  src: [
    {
      path: "../../public/fonts/AllianceNo2-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-alliance",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STARUP - Transform thought into technology",
  description: "思想をテクノロジーに変え、産業と文化の構造を再構築する。AI技術とイノベーションで未来を創造するスタートアップ企業です。",
  keywords: ["スタートアップ", "AI", "テクノロジー", "イノベーション", "DX", "デジタル変革"],
  authors: [{ name: "STARUP" }],
  creator: "STARUP",
  publisher: "STARUP",
  openGraph: {
    title: "STARUP - Transform thought into technology",
    description: "思想をテクノロジーに変え、産業と文化の構造を再構築する。",
    url: "https://starup.co.jp",
    siteName: "STARUP",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STARUP - Transform thought into technology",
    description: "思想をテクノロジーに変え、産業と文化の構造を再構築する。",
    creator: "@starup01",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png", 
        sizes: "16x16",
        type: "image/png",
      }
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${alliance.variable} antialiased`}
      >
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              padding: '12px 16px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
