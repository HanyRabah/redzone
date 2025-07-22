import type { Metadata } from "next";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import LoadingScreen from "@/components/Layout/LoadingScreen";
import MousePointer from "@/components/Layout/MousePointer";
import ScrollTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/style/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Red Zone - Creative Digital Solutions",
  description:
    "We generate creative & innovation ideas for your business. Best solutions & ideas for digital transformation.",
  keywords:
    "digital agency, creative solutions, web design, branding, portfolio",
  authors: [{ name: "Red Zone Team" }],
  creator: "Red Zone",
  publisher: "Red Zone",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://redzone.com",
    title: "Red Zone - Creative Digital Solutions",
    description: "We generate creative & innovation ideas for your business.",
    siteName: "Red Zone",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Red Zone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Zone - Creative Digital Solutions",
    description: "We generate creative & innovation ideas for your business.",
    images: ["/og-image.jpg"],
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
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f70000" />
      </head>
      <body>
        <main className="relative mb-230 md:mb-100 bg-white">
          <ThemeProvider theme={theme}>
            <LoadingScreen />
            <Header />
            <MousePointer />
            <ScrollTop />
            {children}
            <Footer />
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
