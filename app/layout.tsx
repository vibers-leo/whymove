import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhyMove | 변동성 알림 대시보드",
  description: "암호화폐 시장 변동성의 원인을 실시간으로 파악하세요. 트레이더를 위한 프리미엄 대시보드.",
  openGraph: {
    title: "WhyMove | 변동성 알림 대시보드",
    description: "암호화폐 시장 변동성의 원인을 실시간으로 파악하세요. 트레이더를 위한 프리미엄 대시보드.",
    url: "https://whymove.vercel.app",
    siteName: "WhyMove",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhyMove | 변동성 알림 대시보드",
    description: "암호화폐 시장 변동성의 원인을 실시간으로 파악하세요. 트레이더를 위한 프리미엄 대시보드.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WhyMove",
              "url": "https://whymove.vercel.app",
              "description": "암호화폐 시장 변동성의 원인을 실시간으로 파악하는 트레이더용 프리미엄 대시보드",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "creator": {
                "@type": "Organization",
                "name": "계발자들 (Vibers)",
                "url": "https://vibers.co.kr"
              },
              "inLanguage": "ko"
            })
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7704550771011130"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* 노이즈 텍스처 오버레이 */}
            <div className="noise-overlay" />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
