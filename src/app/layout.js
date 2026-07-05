import { Inter, Playfair_Display } from "next/font/google";
import CartProvider from "@/components/CartProvider";
import FocusOnPageStart from "@/components/a11y/FocusOnPageStart";
import RouteAnnouncer from "@/components/a11y/RouteAnnouncer";
import ScrollRestoration from "@/components/ScrollRestoration";
import { AuthProvider } from "@/context/AuthContext";
import { defaultMetadata } from "@/config";
import { ACTIVE_THEME_ID } from "@/theme";
import "./globals.css";
import "@/theme/themes.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
  manifest: "/site.webmanifest",
  icons: {
    icon: "/images/logo-mark.svg",
    apple: "/images/logo-mark.svg",
  },
  openGraph: {
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={ACTIVE_THEME_ID}
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body
        className="flex min-h-dvh flex-col overflow-x-clip bg-site-bg font-sans text-site-fg"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <FocusOnPageStart />
            <RouteAnnouncer />
            <ScrollRestoration />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
