import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { GachaProvider } from "./context/GachaContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Uma Musume Gacha Simulator",
  description: "A retro-styled gacha simulator for Uma Musume characters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{ background: '#F8F3CE', color: '#57564F' }}
      >
        <GachaProvider>
          <Navigation />
          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </GachaProvider>
      </body>
    </html>
  );
}
